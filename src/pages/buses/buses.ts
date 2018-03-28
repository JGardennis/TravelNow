// ********************************************
// IMPORTS
// ********************************************
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,
  ModalController, ViewController, AlertController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';

// ********************************************
// PROVIDERS
// ********************************************
import { TransportApiProvider } from '../../providers/transport-api/transport-api';

// ********************************************
// CLASSES
// ********************************************
class Bus {
  direction;
  departTime;
  line;

  constructor(dir: string, time: string, line: string) {
    this.direction = dir;
    this.departTime = time;
    this.line = line;
  }
}

class BusStop {
  name;
  atco;
  distance;
  running: Array<Bus>;

  constructor(name: string, code: string, dist: number) {
    this.name = name;
    this.atco = code;
    this.distance = dist;
    this.running = new Array<Bus>();
  }
}

// ********************************************
// COMPONENT
// ********************************************
@Component({
  templateUrl: 'busInfo.html',
  selector: 'bus-info'
})
export class BusInfoPage {
  selectedStop;

  constructor(
    public params:    NavParams,
    public viewCtrl:  ViewController
  ) {
    this.selectedStop = this.params.get('busStop');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

@Component({
  selector: 'page-buses',
  templateUrl: 'buses.html'
})
export class BusPage {

  private allBusStops : Array<BusStop>;
  populateStatus;

  constructor(
    public navCtrl: NavController,
    public loadCtrl: LoadingController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public location: Geolocation,
    public transportApi: TransportApiProvider
    ) {
      this.allBusStops = new Array<BusStop>();
  }
  /************************
  @name:      openModal
  @desc:      opens new page showing all buses in operation at selected stop
  @param selectedStop:   a selected bus stop
  ************************/
  openModal(selectedStop)
  {
    var index = this.linkBusStop(selectedStop.busStop);
    var unWrappedBusStop = this.allBusStops[index];

    this.initModalData(unWrappedBusStop);

    // Display populated BusInfoPage
    let modal = this.modalCtrl.create(BusInfoPage, selectedStop);
    modal.present();
    // this.processModalData(unWrappedBusStop);

    // // Check if bus stop has previously been populated, set status accordingly
    // //    populate if needed
    // if(unWrappedBusStop.running.length < 1) {
    //   console.log('Bus stop not populated... populating');
    //   this.populateStatus = false;
    //   this.processModalData(unWrappedBusStop);
    // }
    // else this.populateStatus = true;
    //
    // // Open modal if populated
    // if(this.populateStatus) {
    //   let modal = this.modalCtrl.create(BusInfoPage, unWrappedBusStop);
    //   modal.present();
    // }
  }

  /************************
  @name:      ionViewDidLoad
  @desc:      runs function as soon as page is loaded
  ************************/
  ionViewDidLoad()
  {
    console.log('Bus Page Loaded...');

    let loadingPrompt = this.loadCtrl.create({ content: 'Finding bus stops...'});
    loadingPrompt.present();

    this.initPageData();

    setTimeout( () => { loadingPrompt.dismiss() }, 2000);
  }

  /************************
  @name:      initPageData
  @desc:      creates xml link to initialise Transport API with geolocation
  ************************/
  initPageData()
  {
    //get user's location
    this.location.getCurrentPosition().then((response) => {
      var lat = response.coords.latitude;
      var long = response.coords.longitude;

      console.log('Latitude: ' + lat);
      console.log('longitude: ' + long);

      var link = 'https://transportapi.com/v3/uk/bus/stops/near.json?app_id=8f3fc284&app_key=529d9fe661f4431534026d94dfcd76a8' +
                    '&lat=' + lat + '&lon=' + long;

      this.transportApi.readXml(link, (xml) => this.processBusStopData(xml));

    });
  }

  /************************
  @name:      initModalData
  @desc:      creates xml link to initialise Transport API with atco code of
              selected bus stop
  ************************/
  initModalData(busStop : BusStop)
  {
    var msg = 'Finding buses at ' + busStop.name + '...';
    let loadingPrompt = this.loadCtrl.create({ content: msg});
    loadingPrompt.present();

    var link = 'https://transportapi.com/v3/uk/bus/stop/' + busStop.atco +
          '/live.json?app_id=8f3fc284&app_key=529d9fe661f4431534026d94dfcd76a8&group=route&nextbuses=yes';

    this.transportApi.readXml(link, (xml) => this.processModalData(xml, busStop))

    setTimeout( () => { loadingPrompt.dismiss() }, 2000);


  }

  /************************
  @name:      linkBusStop
  @desc:      search bus stops to find match to bus stop selected by user,
              thgis is needed because of wrapper that is generated by NavParams
  @param busStop:   the bus stop to search for and return
  ************************/
  linkBusStop(busStop : BusStop) {
    for(var i = 0; i < this.allBusStops.length; i++)
      if(this.allBusStops[i].name == busStop.name)
        return i;
  }

  /************************
  @name:      processBusStopData
  @desc:      interprets all bus stop JSON data
  @param apiData:   the JSON formatted Api data
  ************************/
  processBusStopData(apiData)
  {
    var busStops = apiData.stops;

    for(var i = 0; i < busStops.length; i++) {
      let currentStop = new BusStop(busStops[i].name, busStops[i].atcocode, busStops[i].distance);
      this.allBusStops.push(currentStop);
    }

    this.allBusStops.sort( (s1, s2): number => {
      if(s1.distance > s2.distance) return 1;
      if(s1.distance < s2.distance) return -1;
      return 0;
    })

    console.log(this.allBusStops);
  }

  /************************
  @name:      processModalData
  @desc:      uses ATCO code of a BusStop to find all operating buses
  @param apiData:   the JSON formatted Api data
  ************************/
  processModalData(apiData, busStop : BusStop) {

    var departures = apiData.departures;

    // Check that Api data is not empty
    if(departures) {

      // Each route number is treated an object in JSON
      for(var route in departures) {

        // Each bus under each route is then treated as an array element
        for(var i = 0; i < departures[route].length; i++) {

          // Get Current Bus in array
          var currentBus = departures[route][i];

          // Create new bus with current bus details
          let bus = new Bus(
            currentBus.direction,
            currentBus.aimed_departure_time,
            currentBus.line
          );

          // Add new bus to the Bus Stop's list of operating buses
          busStop.running.push(bus);
        }
      }
    }
    // Data is empty
    else {
      var msg = 'There are currently no buses running at ' + busStop.name;

      // Display alert to user
      let alert = this.alertCtrl.create({
        title: 'No buses found!',
        subTitle: msg,
        buttons: ['OK']
      });

      alert.present();
    }
  }
}

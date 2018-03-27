// ********************************************
// IMPORTS
// ********************************************
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,
  ModalController, ViewController } from 'ionic-angular';

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

  constructor(dir: string, hr: string, min: string, line: string) {
    this.direction = dir;
    this.departTime = hr;
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

  constructor(
    public navCtrl: NavController,
    public loadCtrl: LoadingController,
    public location: Geolocation,
    public transportApi: TransportApiProvider,
    public modalCtrl: ModalController) {
      this.allBusStops = new Array<BusStop>();

  }
  /************************
  @name:      openModal
  @desc:      opens new page showing all buses in operation at selected stop
  @param selectedStop:   a selected bus stop
  ************************/
  openModal(selectedStop : BusStop) {
    let modal = this.modalCtrl.create(BusInfoPage, selectedStop);
    modal.present();

    this.populateBusStop(selectedStop);
  }

  /************************
  @name:      ionViewDidLoad
  @desc:      runs function as soon as page is loaded
  ************************/
  ionViewDidLoad()
  {
    console.log('Bus Page Loaded...');

    let loadPrompt = this.loadCtrl.create({
      content: 'Finding nearest buses...'
    });

    loadPrompt.present();

    this.initBusData();

    setTimeout( () => {
      loadPrompt.dismiss();
    }, 2000);
  }

  /************************
  @name:      initBusData
  @desc:      creates xml link to initialise Transport API with geolocation
  ************************/
  initBusData()
  {
    console.log('HERE');

    //get user's location
    this.location.getCurrentPosition().then((response) => {
      var lat = response.coords.latitude;
      var long = response.coords.longitude;

      console.log('Latitude: ' + lat);
      console.log('longitude: ' + long);

      var apiLink = 'https://transportapi.com/v3/uk/bus/stops/near.json?app_id=8f3fc284&app_key=529d9fe661f4431534026d94dfcd76a8' +
                    '&lat=' + lat + '&lon=' + long;

      this.transportApi.readXml(apiLink, (xml) => this.processApiData(xml));

    });
  }

  /************************
  @name:      processApiData
  @desc:      interprets all Api data received from requests
  @param apiData:   the raw JSON formatted Api data
  ************************/
  processApiData(apiData)
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
  @name:      populateBusStop
  @desc:      uses ATCO code of a BusStop to find all operating buses
  @param busStop:   the Bus stop to use
  ************************/
  populateBusStop(data) {

    var name = data.busStop.name;
    var atco = data.busStop.atco;
    var dist = data.busStop.distance;
    let busStop = new BusStop(name, atco, dist);


    let loadPrompt = this.loadCtrl.create({
      content: 'Finding buses at' + busStop.name + '...'
    });

    loadPrompt.present();

    var link = 'https://transportapi.com/v3/uk/bus/stop/' + busStop.atco +
          '/live.json?app_id=8f3fc284&app_key=529d9fe661f4431534026d94dfcd76a8&group=route&nextbuses=yes';

    //console.log(busStop);

    this.transportApi.readXml(link, (xml) => populate(xml));

    var populate = function(stopData) {

      var departures = stopData.departures;

      // Each route number is treated an object in JSON
      for(var route in departures) {

        // Each bus under each route is then treated as an array element
        for(var i = 0; i < departures[route].length; i++) {

        }
      }

    }

    loadPrompt.dismiss();

  }
}

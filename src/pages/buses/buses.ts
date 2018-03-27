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
  time_Hour;
  time_Minute;
  bus_line;

  constructor(dir: string, hr: string, min: string, line: string) {
    this.direction = dir;
    this.time_Hour = hr;
    this.time_Minute = min;
    this.bus_line = line;
  }
}

class BusStop {
  stop_Name;
  atco_Code;
  distance;
  running_Buses: Array<Bus>;

  constructor(name: string, code: string, dist: number) {
    this.stop_Name = name;
    this.atco_Code = code;
    this.distance = dist;
    this.running_Buses = new Array<Bus>();
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
  busInfo;

  constructor(
    public params:    NavParams,
    public viewCtrl:  ViewController
  ) {
    this.busInfo = this.params.get('busInfo');
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
    public transportApi: TransportApiProvider) {
      this.allBusStops = new Array<BusStop>();

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
  @name:      showBusInfo
  @desc:      opens new page showing all buses in operation at selected stop
  @param busStop:   a selected bus stop
  ************************/
  showBusInfo(busStop) {
    console.log(busStop);
  }

  /************************
  @name:      initBusData
  @desc:      creates xml link to initialise Transport API with geolocation
  ************************/
  initBusData()
  {
    //get user's location
    this.location.getCurrentPosition().then((response) => {
      var lat = response.coords.latitude;
      var long = response.coords.longitude;

      console.log('Latitude: ' + lat);
      console.log('longitude: ' + long);

      var apiLink = 'https://transportapi.com/v3/uk/bus/stops/near.json?app_id=8f3fc284&app_key=529d9fe661f4431534026d94dfcd76a8' +
                    '&lat=' + lat + '&lon=' + long;

      this.transportApi.readXml(apiLink, (xml) => this.processApiData(xml));

    })
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
      let currentStop = new BusStop(busStops[i].stop_name, busStops[i].atcocode, busStops[i].distance);
      this.allBusStops.push(currentStop);
    }

    this.allBusStops.sort( (s1, s2): number => {
      if(s1.distance > s2.distance) return 1;
      if(s1.distance < s2.distance) return -1;
      return 0;
    })

    console.log(this.allBusStops);

  }
}

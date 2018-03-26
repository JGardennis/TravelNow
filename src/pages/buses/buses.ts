// ********************************************
// IMPORTS
// ********************************************
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,
  ModalController, ViewController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';

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


@Component({
  selector: 'page-buses',
  templateUrl: 'buses.html'
})
export class BusPage {

  constructor(
    public navCtrl: NavController,
    public loadCtrl: LoadingController,
    public location: Geolocation) {

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
    //get user's location
    this.location.getCurrentPosition().then((response) => {
      var lat = response.coords.latitude;
      var long = response.coords.longitude;

      console.log('Latitude: ' + lat);
      console.log('longitude: ' + long);

      var apiLink = 'https://transportapi.com/v3/uk/bus/stops/near.json?app_id=8f3fc284&app_key=529d9fe661f4431534026d94dfcd76a8' +
                    '&lat=' + lat + '&lon=' + long;

    })
  }

}

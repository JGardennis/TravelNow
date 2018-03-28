// IMPORTS
import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {
  allBuses;
  busLines = [];

  constructor(public params : NavParams) {
    this.allBuses = this.params.get('allBuses');
    this.busLines = new Array<string>();

    for(var i = 0; i < this.allBuses.length; i++) {
      
    }

  }

  /************************
  @name:      getBusLines
  @desc:      searches all current bus stops and gets all individual lines
  ************************/
  getBusLines() {

  }

  ionViewDidLoad() {
    console.log(this.allBuses);
  }

}

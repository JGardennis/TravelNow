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
      // add current bus' line to busLines list if it doesn't exist already
      if(!this.checkList(this.busLines, this.allBuses[i].line))
        this.busLines.push(this.allBuses[i].line);
    }

  }

  /************************
  @name:      checkList
  @desc:      checks if a given array has a given element
  @param list:   an array to check
  @param element: an element to check for
  @return returns true if found, false if not
  ************************/
  checkList(list : Array<String>, element) {
    for(var i = 0; i < list.length; i++)
      if(list[i] == element)
        return true;
    return false;
  }

  /************************
  @name:      filter
  @desc:      filters all results given a bus line to filter by
  @param busLines:   the bus line to filter
  ************************/
  filter(busLine) {

    var noFilter = this.allBuses;
    
  }

}

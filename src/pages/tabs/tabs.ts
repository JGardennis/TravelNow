import { Component } from '@angular/core';

import { BusPage } from '../buses/buses';
import { TrainPage } from '../trains/trains';
import { SettingPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = BusPage;
  tab2Root = TrainPage;
  tab3Root = SettingPage;

  constructor() {

  }
}

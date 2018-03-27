import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusPage } from './buses';
import { BusInfoPage } from './buses';

@NgModule({
  declarations: [
    BusPage,
    BusInfoPage
  ],
  imports: [
    IonicPageModule.forChild(BusPage),
  ],
  exports: [
    BusPage,
    BusInfoPage
  ]
})
export class BusPageModule {}

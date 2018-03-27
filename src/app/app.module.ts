import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { BusPage } from '../pages/buses/buses';
import { BusInfoPage } from '../pages/buses/buses';

import { TrainPage } from '../pages/trains/trains';
import { SettingPage } from '../pages/settings/settings';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { TransportApiProvider } from '../providers/transport-api/transport-api';

@NgModule({
  declarations: [
    MyApp,
    BusPage,
    BusInfoPage,
    TrainPage,
    SettingPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    BusPage,
    BusInfoPage,
    TrainPage,
    SettingPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TransportApiProvider
  ]
})
export class AppModule {}

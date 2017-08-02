<<<<<<< HEAD
import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { HttpModule } from "@angular/http";
import { IonicStorageModule } from "@ionic/storage";
import { AttendanceApp } from "./app.component";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { NativeGeocoder } from "@ionic-native/native-geocoder";
import { LocationAccuracy } from "@ionic-native/location-accuracy";
import { Device } from "@ionic-native/device";
import { Diagnostic } from "@ionic-native/diagnostic";
import { AppVersion } from "@ionic-native/app-version";
import { Toast } from "@ionic-native/toast";
import { DeviceFeedback } from "@ionic-native/device-feedback";
import { Keyboard } from "@ionic-native/keyboard";
import "rxjs/add/operator/timeout";
import "rxjs/add/operator/map";
import { UserProvider } from "../providers/user/user";
import { AttendanceProvider } from "../providers/attendance/attendance";
import { EmailProvider } from "../providers/email/email";

@NgModule({
  declarations: [AttendanceApp],
=======
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { AttendanceApp } from './app.component';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Device } from '@ionic-native/device';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AppVersion } from '@ionic-native/app-version';
import { Toast } from '@ionic-native/toast';
import { DeviceFeedback } from '@ionic-native/device-feedback';
import { Keyboard } from '@ionic-native/keyboard';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/map';
import { UserProvider } from '../providers/user/user';
import { AttendanceProvider } from '../providers/attendance/attendance';
import { EmailProvider } from '../providers/email/email';

@NgModule({
  declarations: [
    AttendanceApp
  ],
>>>>>>> af919822dcc014775e925fc58e77cf4e075dafe8
  imports: [
    BrowserModule,
    IonicModule.forRoot(AttendanceApp, {
      preloadModules: true
    }),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
<<<<<<< HEAD
  entryComponents: [AttendanceApp],
=======
  entryComponents: [
    AttendanceApp
  ],
>>>>>>> af919822dcc014775e925fc58e77cf4e075dafe8
  providers: [
    UserProvider,
    AttendanceProvider,
    EmailProvider,
    InAppBrowser,
    Device,
    StatusBar,
    SplashScreen,
    NativeGeocoder,
    LocationAccuracy,
    Diagnostic,
    AppVersion,
    Toast,
    DeviceFeedback,
    Keyboard,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
<<<<<<< HEAD
export class AppModule {}
=======
export class AppModule { }
>>>>>>> af919822dcc014775e925fc58e77cf4e075dafe8

<<<<<<< HEAD
import { Component, ViewChild } from "@angular/core";
import { Events, Nav, Platform, ModalController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Storage } from "@ionic/storage";

import { UserProvider } from "../providers/user/user";

@Component({
  templateUrl: "app.html"
=======
import { Component, ViewChild } from '@angular/core';
import { Events, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { UserProvider } from '../providers/user/user';

@Component({
  templateUrl: 'app.html'
>>>>>>> af919822dcc014775e925fc58e77cf4e075dafe8
})
export class AttendanceApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  public alert: any;
  public count: number;

  constructor(
    public events: Events,
    public userData: UserProvider,
    public platform: Platform,
    public storage: Storage,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
<<<<<<< HEAD
    public modalCtrl: ModalController
  ) {
    this.storage.get("hasSeenTutorial").then(hasSeenTutorial => {
      if (hasSeenTutorial) {
        this.storage.get("hasLoggedIn").then(hasLoggedIn => {
          localStorage.setItem('splashstatus', 'true');
          if (hasLoggedIn) {
            this.rootPage = "TabsPage";
          } else {
            this.rootPage = "LoginPage";
          }
        });
      } else {
        this.rootPage = "TutorialPage";
      }
      this.platformReady();
    });
=======
  ) {

    this.storage.get('hasSeenTutorial').then((hasSeenTutorial) => {
      if (hasSeenTutorial) {
        this.storage.get('hasLoggedIn').then((hasLoggedIn) => {
          if (hasLoggedIn) {
            this.rootPage = 'TabsPage';
          } else {
            this.rootPage = 'LoginPage';
          }
        })
      } else {
        this.rootPage = 'TutorialPage';
      }
      this.platformReady()
    })
>>>>>>> af919822dcc014775e925fc58e77cf4e075dafe8
  }

  platformReady() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
<<<<<<< HEAD
      this.statusBar.backgroundColorByHexString("#f39c12");
=======
      this.statusBar.backgroundColorByHexString('#f39c12');
>>>>>>> af919822dcc014775e925fc58e77cf4e075dafe8
    });
  }
}

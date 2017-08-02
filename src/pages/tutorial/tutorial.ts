<<<<<<< HEAD
import { Component, ViewChild } from "@angular/core";
import { NavController, Slides, IonicPage } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { DeviceFeedback } from "@ionic-native/device-feedback";

@IonicPage()
@Component({
  selector: "page-tutorial",
  templateUrl: "tutorial.html"
})
export class TutorialPage {
  showSkip = true;
  splash = true;

  @ViewChild("slides") slides: Slides;
=======
import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DeviceFeedback } from '@ionic-native/device-feedback';

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})

export class TutorialPage {
  showSkip = true;

  @ViewChild('slides') slides: Slides;
>>>>>>> af919822dcc014775e925fc58e77cf4e075dafe8

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    private deviceFeedback: DeviceFeedback
<<<<<<< HEAD
  ) {}

  startApp() {
    this.deviceFeedback.acoustic();
    this.navCtrl.push("LoginPage").then(() => {
      this.storage.set("hasSeenTutorial", "true");
    });
=======
  ) { }

  startApp() {
    this.deviceFeedback.acoustic();
    this.navCtrl.push('LoginPage').then(() => {
      this.storage.set('hasSeenTutorial', 'true');
    })
>>>>>>> af919822dcc014775e925fc58e77cf4e075dafe8
  }

  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }

  ionViewWillEnter() {
    this.slides.update();
  }
<<<<<<< HEAD

  ionViewDidLoad() {
    localStorage.setItem("splashstatus", "false");
    let status = localStorage.getItem("splashstatus");
    if (status === "false") {
      setTimeout(() => {
        this.splash = false;
      }, 5000);
    }
  }
=======
>>>>>>> af919822dcc014775e925fc58e77cf4e075dafe8
}

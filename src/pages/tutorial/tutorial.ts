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

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    private deviceFeedback: DeviceFeedback
  ) {}

  startApp() {
    this.deviceFeedback.acoustic();
    this.navCtrl.push("LoginPage").then(() => {
      this.storage.set("hasSeenTutorial", "true");
    });
  }

  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }

  ionViewWillEnter() {
    this.slides.update();
  }

  ionViewDidLoad() {
    localStorage.setItem("splashstatus", "false");
    let status = localStorage.getItem("splashstatus");
    if (status === "false") {
      setTimeout(() => {
        this.splash = false;
      }, 5000);
    }
  }
}

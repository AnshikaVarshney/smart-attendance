import { Component } from "@angular/core";
import { ViewController, App, IonicPage } from "ionic-angular";
import { DeviceFeedback } from "@ionic-native/device-feedback";

@IonicPage()
@Component({
  template: `
    <ion-list>
      <button ion-item (tap)="faq()">FAQ</button>
      <button ion-item (tap)="support()">Reset Device ID</button>
    </ion-list>
  `
})
export class PopoverFrontPage {
  constructor(
    public viewCtrl: ViewController,
    public app: App,
    private deviceFeedback: DeviceFeedback
  ) {}

  faq() {
    this.deviceFeedback.acoustic();
    this.viewCtrl.dismiss().then(() => {
      this.app.getRootNav().push("FAQPage");
    });
  }

  support() {
    this.deviceFeedback.acoustic();
    this.viewCtrl.dismiss().then(() => {
      this.app.getRootNav().push("SupportFrontPage");
    });
  }

  close(url: string) {
    window.open(url, "_blank");
    this.viewCtrl.dismiss();
  }
}

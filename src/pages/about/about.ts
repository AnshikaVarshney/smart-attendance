import { Component } from "@angular/core";
import { PopoverController } from "ionic-angular";
import { IonicPage } from "ionic-angular";
import { AppVersion } from "@ionic-native/app-version";
import { DeviceFeedback } from "@ionic-native/device-feedback";

@IonicPage()
@Component({
  selector: "page-about",
  templateUrl: "about.html"
})
export class AboutPage {
  public aboutVer: string;
  public aboutName: string;
  constructor(
    private appVersion: AppVersion,
    public popoverCtrl: PopoverController,
    private deviceFeedback: DeviceFeedback
  ) {}

  presentPopover(event: Event) {
    this.deviceFeedback.acoustic();
    let popover = this.popoverCtrl.create("PopoverPage");
    popover.present({ ev: event });
  }

  ionViewWillEnter() {
    this.appVersion.getVersionNumber().then(data => {
      this.aboutVer = data;
    });
    this.appVersion.getAppName().then(data => {
      this.aboutName = data;
    });
  }
}

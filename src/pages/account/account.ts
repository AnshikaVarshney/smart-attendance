import { Component } from "@angular/core";
import { PopoverController, NavController, IonicPage } from "ionic-angular";
import { DeviceFeedback } from "@ionic-native/device-feedback";

import { UserProvider } from "../../providers/user/user";

@IonicPage()
@Component({
  selector: "page-account",
  templateUrl: "account.html"
})
export class AccountPage {
  staff: { staff_id?: any; name?: any; email?: string; password?: string } = {};
  PasswordPage = "PasswordPage";
  constructor(
    public user: UserProvider,
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    private deviceFeedback: DeviceFeedback
  ) {}

  presentPopover(event: Event) {
    this.deviceFeedback.acoustic();
    let popover = this.popoverCtrl.create("PopoverPage");
    popover.present({ ev: event });
  }

  click() {
    this.deviceFeedback.acoustic();
    this.navCtrl.push("PasswordPage");
  }

  ionViewWillEnter() {
    this.user.getUser().then(val => {
      this.staff.staff_id = val.login;
      this.staff.name = val.firstname + " " + val.lastname;
      this.staff.email = val.email;
      this.staff.password = val.password;
    });
  }
}

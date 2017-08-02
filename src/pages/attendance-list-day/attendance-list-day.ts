import { Component } from "@angular/core";
<<<<<<< HEAD
import {
  NavController,
  LoadingController,
  Refresher,
  IonicPage
} from "ionic-angular";
=======
import { NavController, LoadingController, IonicPage } from "ionic-angular";
>>>>>>> af919822dcc014775e925fc58e77cf4e075dafe8
import * as moment from "moment";
import { UserProvider } from "../../providers/user/user";
import { AttendanceProvider } from "../../providers/attendance/attendance";
import { Toast } from "@ionic-native/toast";
import { DeviceFeedback } from "@ionic-native/device-feedback";

@IonicPage()
@Component({
  selector: "page-attendance-list-day",
  templateUrl: "attendance-list-day.html"
})
export class AttendanceListDayPage {
  private posts: any;
  private items: any;
  tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  localISOTime = new Date(Date.now() - this.tzoffset)
    .toISOString()
    .slice(0, -1);
  today: any;
  isenabled: boolean = false;

  constructor(
    private toast: Toast,
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    public user: UserProvider,
    public attend: AttendanceProvider,
    private deviceFeedback: DeviceFeedback
  ) {
    this.viewAll();
  }

<<<<<<< HEAD
  doRefresh(refresher: Refresher) {
    this.deviceFeedback.acoustic();
    this.initializeItems();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

=======
>>>>>>> af919822dcc014775e925fc58e77cf4e075dafe8
  viewAll() {
    this.today = null;
    let loadingPopup = this.loadingCtrl.create({
      content: "Retrieving..."
    });
    let staff_id = localStorage.getItem("id");
    this.attend.retrieveAttendanceByDay(staff_id).subscribe(
      data => {
        if (data) {
          loadingPopup.present().then(() => {
            this.posts = data;
            this.initializeItems();
            loadingPopup.dismiss();
          });
          this.sendNotification(`${staff_id}'s attendance records.`);
        } else {
          this.sendNotification("Something went wrong!");
        }
        this.isenabled = true;
      },
      (error: any) => {
        console.log("There is no connection to the database server.");
        let msg =
          "Attendance Retrieval Failed!\nThere is no connection to the database server. Please try again later.";
        this.sendNotification(msg);
        this.isenabled = false;
      }
    );
  }

  initializeItems() {
    this.items = this.posts;
  }

  getItems(ev: any) {
    this.deviceFeedback.acoustic();
    let loader = this.loadingCtrl.create({
      content: "Loading..."
    });
    loader.present().then(() => {
      this.initializeItems();
      let val = moment(ev).format("MMM DD YYYY");
      if (val && val.trim() != "") {
        this.items = this.items.filter((item: any) => {
          return moment(item.curdate).format("MMM DD YYYY").indexOf(val) > -1;
        });
      }
      loader.dismiss();
    });
  }

  resetItems() {
    this.deviceFeedback.acoustic();
    this.viewAll();
  }

  sendNotification(message: any): void {
    let options = {
      message: message,
      position: "bottom",
      addPixelsY: -200
    };
    this.toast.showWithOptions(options).subscribe(toast => {
      console.log(toast);
    });
  }

  viewEntry(param: any) {
    this.deviceFeedback.acoustic();
    this.navCtrl.push("AttendanceListTimePage", param);
  }
}

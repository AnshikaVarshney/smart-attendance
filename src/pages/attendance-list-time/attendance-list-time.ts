import { Component } from "@angular/core";
import {
  NavParams,
  NavController,
  LoadingController,
  IonicPage
} from "ionic-angular";
import * as moment from "moment";
import { UserProvider } from "../../providers/user/user";
import { AttendanceProvider } from "../../providers/attendance/attendance";
import { Toast } from "@ionic-native/toast";
import { DeviceFeedback } from "@ionic-native/device-feedback";

@IonicPage()
@Component({
  selector: "page-attendance-list-time",
  templateUrl: "attendance-list-time.html"
})
export class AttendanceListTimePage {
  private posts: any;
  private items: any;
  tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  localISOTime = new Date(Date.now() - this.tzoffset)
    .toISOString()
    .slice(0, -1);
  selectedDate: any;

  constructor(
    private toast: Toast,
    public NP: NavParams,
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    public user: UserProvider,
    public attend: AttendanceProvider,
    private deviceFeedback: DeviceFeedback
  ) {
    this.selectedDate = this.NP.get("record").curdate;
    let loadingPopup = this.loadingCtrl.create({
      content: "Retrieving..."
    });

    let staff_id = localStorage.getItem("id");
    this.attend.retrieveAttendanceByTime(staff_id, this.selectedDate).subscribe(
      data => {
        if (data) {
          loadingPopup.present().then(() => {
            this.posts = data;
            this.initializeItems();
            loadingPopup.dismiss();
          });
          this.sendNotification(
            `${staff_id}'s attendance records for ${moment(
              this.selectedDate
            ).format("dddd, MMMM Do YYYY")}.`
          );
        } else {
          this.sendNotification("Something went wrong!");
        }
      },
      (error: any) => {
        console.log("There is no connection to the database server.");
        let msg =
          "Attendance Retrieval Failed!\nThere is no connection to the database server. Please try again later.";
        this.sendNotification(msg);
      }
    );
  }

  initializeItems() {
    this.items = this.posts;
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
    this.navCtrl.push("AttendanceViewPage", param);
  }

  viewMap(param: any) {
    this.deviceFeedback.acoustic();
    this.navCtrl.push("MapViewPage", param);
  }
}

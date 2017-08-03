import { Component, ViewChild } from "@angular/core";
import {
  NavParams,
  NavController,
  LoadingController,
  Refresher,
  IonicPage,
  Slides
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
  @ViewChild("mySlider") slider: Slides;
  selectedSegment: string;
  slides: any;
  private posts: any;
  private itemsIn: any;
  private itemsOut: any;
  private items: any;
  tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  localISOTime = new Date(Date.now() - this.tzoffset)
    .toISOString()
    .slice(0, -1);
  selectedDate: any;
  itemIndata: boolean = false;
  itemOutdata: boolean = false;

  constructor(
    private toast: Toast,
    public NP: NavParams,
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    public user: UserProvider,
    public attend: AttendanceProvider,
    private deviceFeedback: DeviceFeedback
  ) {
    this.selectedSegment = "in";
    this.slides = [
      {
        id: "in"
      },
      {
        id: "out"
      }
    ];
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
          /*this.sendNotification(
            `${staff_id}'s attendance records for ${moment(
              this.selectedDate
            ).format("dddd, MMMM Do YYYY")}.`
          );*/
        } else {
          //this.sendNotification("Something went wrong!");
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

  onSegmentChanged(segmentButton: any) {
    const selectedIndex = this.slides.findIndex((slide: any) => {
      return slide.id === segmentButton.value;
    });
    this.slider.slideTo(selectedIndex);
  }

  onSlideChanged(slider: any) {
    this.deviceFeedback.acoustic();
    let index = this.slider.getActiveIndex();
    const currentSlide = this.slides[index];
    this.selectedSegment = currentSlide.id;
  }

  doRefresh(refresher: Refresher) {
    this.deviceFeedback.acoustic();
    this.initializeItems();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  initializeItems() {
    this.items = this.posts;
    this.listItems();
    this.checkItems();
  }

  listItems() {
    let valIn = "in";
    if (valIn && valIn.trim() != "") {
      this.itemsIn = this.items.filter((item: any) => {
        return item.punch_type.indexOf(valIn) > -1;
      });
    }
    let valOut = "out";
    if (valOut && valOut.trim() != "") {
      this.itemsOut = this.items.filter((item: any) => {
        return item.punch_type.indexOf(valOut) > -1;
      });
    }
  }

  checkItems() {
    if (this.itemsIn == "") {
      this.itemIndata = false;
    } else {
      this.itemIndata = true;
    }
    if (this.itemsOut == "") {
      this.itemOutdata = false;
    } else {
      this.itemOutdata = true;
    }
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

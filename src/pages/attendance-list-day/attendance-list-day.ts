import { Component, ViewChild } from "@angular/core";
import {
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
  selector: "page-attendance-list-day",
  templateUrl: "attendance-list-day.html"
})
export class AttendanceListDayPage {
  @ViewChild("mySlider") slider: Slides;
  selectedSegment: string;
  slides: any;
  private posts: any;
  private itemsD: any;
  private itemsM: any;
  private itemsY: any;
  private items: any;
  tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  localISOTime = new Date(Date.now() - this.tzoffset)
    .toISOString()
    .slice(0, -1);
  isenabled: boolean = false;
  isenabledref: boolean = false;
  today: any;
  itemDay: any = moment(this.localISOTime).format("MMM DD YYYY");
  itemMonth: any = moment(this.localISOTime).format("MMM");
  itemYear: any = moment(this.localISOTime).format("YYYY");
  itemdata: boolean = false;
  itemDdata: boolean = false;
  itemMdata: boolean = false;
  itemYdata: boolean = false;

  constructor(
    private toast: Toast,
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    public user: UserProvider,
    public attend: AttendanceProvider,
    private deviceFeedback: DeviceFeedback
  ) {
    this.selectedSegment = "all";
    this.slides = [
      {
        id: "all"
      },
      {
        id: "today"
      },
      {
        id: "month"
      },
      {
        id: "year"
      }
    ];
    this.view();
  }

  onSegmentChanged(segmentButton: any) {
    this.deviceFeedback.acoustic();
    const selectedIndex = this.slides.findIndex((slide: any) => {
      return slide.id === segmentButton.value;
    });
    this.slider.slideTo(selectedIndex);
  }

  onSlideChanged(slider: any) {
    let index = this.slider.getActiveIndex();
    const currentSlide = this.slides[index];
    this.selectedSegment = currentSlide.id;
    if (this.selectedSegment == "all") {
      this.isenabledref = false;
    } else {
      this.isenabledref = true;
    }
  }

  doRefresh(refresher: Refresher) {
    this.today = null;
    this.deviceFeedback.acoustic();
    this.refreshItem();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  view() {
    this.today = null;
    let loadingPopup = this.loadingCtrl.create({
      content: "Retrieving..."
    });
    let staff_id = localStorage.getItem("id");
    this.attend.retrieveAttendanceByDay(staff_id).subscribe(
      data => {
        loadingPopup.present().then(() => {
          if (data) {
            this.posts = data;
            this.initializeItems();
          }
          loadingPopup.dismiss();
        });
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

  refreshItem() {
    let staff_id = localStorage.getItem("id");
    this.attend.retrieveAttendanceByDay(staff_id).subscribe(
      data => {
        if (data) {
          this.posts = data;
          this.initializeItemsAll();
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

  viewAll() {
    let loadingPopup = this.loadingCtrl.create({
      content: "Retrieving..."
    });
    let staff_id = localStorage.getItem("id");
    this.attend.retrieveAttendanceByDay(staff_id).subscribe(
      data => {
        loadingPopup.present().then(() => {
          if (data) {
            this.posts = data;
            this.initializeItemsAll();
          }
          loadingPopup.dismiss();
        });
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
    this.listItems();
    this.checkItems();
  }

  initializeItemsAll() {
    this.items = this.posts;
    this.checkItems();
  }

  listItems() {
    this.listItemsD();
    this.listItemsM();
    this.listItemsY();
  }

  listItemsD() {
    let valD = this.itemDay;
    if (valD && valD.trim() != "") {
      this.itemsD = this.items.filter((item: any) => {
        return moment(item.curdate).format("MMM DD YYYY").indexOf(valD) > -1;
      });
    }
  }

  listItemsM() {
    let valM = this.itemMonth;
    if (valM && valM.trim() != "") {
      this.itemsM = this.items.filter((item: any) => {
        return moment(item.curdate).format("MMM").indexOf(valM) > -1;
      });
    }
  }

  listItemsY() {
    let valY = this.itemYear;
    if (valY && valY.trim() != "") {
      this.itemsY = this.items.filter((item: any) => {
        return moment(item.curdate).format("YYYY").indexOf(valY) > -1;
      });
    }
  }

  checkItems() {
    if (this.itemsD.length == 0) {
      this.itemDdata = false;
    } else {
      this.itemDdata = true;
    }
    if (this.itemsM.length == 0) {
      this.itemMdata = false;
    } else {
      this.itemMdata = true;
    }
    if (this.itemsY.length == 0) {
      this.itemYdata = false;
    } else {
      this.itemYdata = true;
    }
    if (this.items.length == 0) {
      this.itemdata = false;
    } else {
      this.itemdata = true;
    }
  }

  getItems(ev: any) {
    this.deviceFeedback.acoustic();
    this.initializeItemsAll();
    let val = moment(ev).format("MMM DD YYYY");
    if (val && val.trim() != "") {
      this.items = this.items.filter((item: any) => {
        return moment(item.curdate).format("MMM DD YYYY").indexOf(val) > -1;
      });
    }
    this.checkItems();
  }

  resetItems() {
    this.today = null;
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

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
  today: any;
  isenabled: boolean = false;
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
    this.viewAll();
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
    this.today = null;
    this.initializeItems();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

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
          //this.sendNotification(`${staff_id}'s attendance records.`);
        } else {
          //this.sendNotification("Something went wrong!");
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
    this.listItems();
    this.checkItems();
  }

  listItems() {
    let valD = this.itemDay;
    if (valD && valD.trim() != "") {
      this.itemsD = this.items.filter((item: any) => {
        return moment(item.curdate).format("MMM DD YYYY").indexOf(valD) > -1;
      });
    }
    let valM = this.itemMonth;
    if (valM && valM.trim() != "") {
      this.itemsM = this.items.filter((item: any) => {
        return moment(item.curdate).format("MMM").indexOf(valM) > -1;
      });
    }
    let valY = this.itemYear;
    if (valY && valY.trim() != "") {
      this.itemsY = this.items.filter((item: any) => {
        return moment(item.curdate).format("YYYY").indexOf(valY) > -1;
      });
    }
  }

  checkItems() {
    if (this.itemsD == "") {
      this.itemDdata = false;
    } else {
      this.itemDdata = true;
    }
    if (this.itemsM == "") {
      this.itemMdata = false;
    } else {
      this.itemMdata = true;
    }
    if (this.itemsY == "") {
      this.itemYdata = false;
    } else {
      this.itemYdata = true;
    }
    if (this.items == "") {
      this.itemdata = false;
    } else {
      this.itemdata = true;
    }
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
        this.itemsD = this.itemsD.filter((item: any) => {
          return moment(item.curdate).format("MMM DD YYYY").indexOf(val) > -1;
        });
        this.itemsM = this.itemsM.filter((item: any) => {
          return moment(item.curdate).format("MMM DD YYYY").indexOf(val) > -1;
        });
        this.itemsY = this.itemsY.filter((item: any) => {
          return moment(item.curdate).format("MMM DD YYYY").indexOf(val) > -1;
        });
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

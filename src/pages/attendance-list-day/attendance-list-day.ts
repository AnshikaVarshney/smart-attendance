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
  private itemsAll: any;
  tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  localISOTime = new Date(Date.now() - this.tzoffset)
    .toISOString()
    .slice(0, -1);
  isenabled: boolean = false;
  isenabledref: boolean = false;
  isenabledrefD: boolean = false;
  isenabledrefM: boolean = false;
  isenabledrefY: boolean = false;
  isenabledinf: boolean = false;
  today: any;
  todayM: any;
  todayY: any;
  itemDay: any = moment(this.localISOTime).format("MMM DD YYYY");
  itemMonth: any = moment(this.localISOTime).format("MMM");
  itemYear: any = moment(this.localISOTime).format("YYYY");
  itemdata: boolean = false;
  itemDdata: boolean = false;
  itemMdata: boolean = false;
  itemYdata: boolean = false;
  start: number = 10;
  hasMoreData: boolean = false;

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
    this.isenabledref = true;
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
      this.isenabledref = true;
      this.isenabledrefD = false;
      this.isenabledrefM = false;
      this.isenabledrefY = false;
      this.isenabledinf = true;
    } else if (this.selectedSegment == "today") {
      this.isenabledref = false;
      this.isenabledrefD = true;
      this.isenabledrefM = false;
      this.isenabledrefY = false;
      this.isenabledinf = false;
    } else if (this.selectedSegment == "month") {
      this.isenabledref = false;
      this.isenabledrefD = false;
      this.isenabledrefM = true;
      this.isenabledrefY = false;
      this.isenabledinf = false;
    } else if (this.selectedSegment == "year") {
      this.isenabledref = false;
      this.isenabledrefD = false;
      this.isenabledrefM = false;
      this.isenabledrefY = true;
      this.isenabledinf = false;
    }
  }

  doRefresh(refresher: Refresher) {
    this.today = null;
    this.todayM = null;
    this.todayY = null;
    this.isenabledinf = false;
    this.deviceFeedback.acoustic();
    setTimeout(() => {
      this.refreshItem();
      setTimeout(() => {
        refresher.complete();
      }, 1000);
    }, 1000);
  }

  doInfinite(infiniteScroll: any) {
    console.log("Begin async operation");
    let staff_id = localStorage.getItem("id");
    this.attend.retrieveAttendanceByDayScroll(staff_id, this.start).subscribe(
      data => {
        if (data) {
          this.posts = data;
          for (let i = 0; i < this.posts.length; i++) {
            this.items.push(this.posts[i]);
          }
          this.start += 10;
          this.initialize();
          if (data.length == 0) {
            this.isenabledinf = true;
          } else {
            this.isenabledinf = false;
          }
        }
      },
      (error: any) => {
        console.log("There is no connection to the database server.");
        let msg =
          "Attendance Retrieval Failed!\nThere is no connection to the database server. Please try again later.";
        this.sendNotification(msg);
      }
    );
    setTimeout(() => {
      console.log("Async operation has ended");
      infiniteScroll.complete();
    }, 1000);
  }

  view() {
    this.today = null;
    this.todayM = null;
    this.todayY = null;
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
          this.initializeItems();
          this.start = 10;
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
    let staff_id = localStorage.getItem("id");
    this.attend.retrieveAttendanceByDayAll(staff_id).subscribe(
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

  initialize() {
    this.listItems();
    this.checkItems();
  }

  initializeItems() {
    this.items = this.posts;
    this.listItems();
    this.checkItems();
  }

  initializeItemsAll() {
    this.itemsAll = this.posts;
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
    let loadingPopup = this.loadingCtrl.create({
      content: "Retrieving..."
    });
    if (ev != null) {
      loadingPopup.present().then(() => {
        this.viewAll();
        setTimeout(() => {
          console.log(ev);
          let val = moment(ev).format("MMM DD YYYY");
          if (val && val.trim() != "") {
            this.items = this.itemsAll.filter((item: any) => {
              return (
                moment(item.curdate).format("MMM DD YYYY").indexOf(val) > -1
              );
            });
          }
          this.checkItems();
          loadingPopup.dismiss();
        }, 1000);
      });
    } else {
      this.viewAll();
      setTimeout(() => {
        console.log(ev);
        let val = moment(ev).format("MMM DD YYYY");
        if (val && val.trim() != "") {
          this.items = this.itemsAll.filter((item: any) => {
            return moment(item.curdate).format("MMM DD YYYY").indexOf(val) > -1;
          });
        }
        this.checkItems();
      }, 1000);
    }
  }

  getItemsM(ev: any) {
    this.deviceFeedback.acoustic();
    let loadingPopup = this.loadingCtrl.create({
      content: "Retrieving..."
    });
    if (ev != null) {
      loadingPopup.present().then(() => {
        this.viewAll();
        setTimeout(() => {
          console.log("ev: " + ev);
          console.log("this.todayM: " + this.todayM);
          let val: string;
          if (ev == "2001") {
            val = "Jan";
          } else if (ev == "2002") {
            val = "Feb";
          } else if (ev == "2003") {
            val = "Mar";
          } else if (ev == "2004") {
            val = "Apr";
          } else if (ev == "2005") {
            val = "May";
          } else if (ev == "2006") {
            val = "Jun";
          } else if (ev == "2007") {
            val = "Jul";
          } else if (ev == "2008") {
            val = "Aug";
          } else if (ev == "2009") {
            val = "Sep";
          } else if (ev == "2010") {
            val = "Oct";
          } else if (ev == "2011") {
            val = "Nov";
          } else if (ev == "2012") {
            val = "Dec";
          }
          if (val && val.trim() != "") {
            this.itemsM = this.itemsAll.filter((item: any) => {
              return moment(item.curdate).format("MMM").indexOf(val) > -1;
            });
          }
          this.checkItems();
          loadingPopup.dismiss();
        }, 1000);
      });
    } else {
      this.viewAll();
      setTimeout(() => {
        console.log("ev: " + ev);
        console.log("this.todayM: " + this.todayM);
        let val: string;
        if (ev == "2001") {
          val = "Jan";
        } else if (ev == "2002") {
          val = "Feb";
        } else if (ev == "2003") {
          val = "Mar";
        } else if (ev == "2004") {
          val = "Apr";
        } else if (ev == "2005") {
          val = "May";
        } else if (ev == "2006") {
          val = "Jun";
        } else if (ev == "2007") {
          val = "Jul";
        } else if (ev == "2008") {
          val = "Aug";
        } else if (ev == "2009") {
          val = "Sep";
        } else if (ev == "2010") {
          val = "Oct";
        } else if (ev == "2011") {
          val = "Nov";
        } else if (ev == "2012") {
          val = "Dec";
        }
        if (val && val.trim() != "") {
          this.itemsM = this.itemsAll.filter((item: any) => {
            return moment(item.curdate).format("MMM").indexOf(val) > -1;
          });
        }
        this.checkItems();
      }, 1000);
    }
  }

  getItemsY(ev: any) {
    this.deviceFeedback.acoustic();
    let loadingPopup = this.loadingCtrl.create({
      content: "Retrieving..."
    });
    if (ev != null) {
      loadingPopup.present().then(() => {
        this.viewAll();
        setTimeout(() => {
          let val = moment(ev).format("YYYY");
          if (val && val.trim() != "") {
            this.itemsY = this.itemsAll.filter((item: any) => {
              return moment(item.curdate).format("YYYY").indexOf(val) > -1;
            });
          }
          this.checkItems();
          loadingPopup.dismiss();
        }, 1000);
      });
    } else {
      this.viewAll();
      setTimeout(() => {
        let val = moment(ev).format("YYYY");
        if (val && val.trim() != "") {
          this.itemsY = this.itemsAll.filter((item: any) => {
            return moment(item.curdate).format("YYYY").indexOf(val) > -1;
          });
        }
        this.checkItems();
      }, 1000);
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
    this.navCtrl.push("AttendanceListTimePage", param);
  }
}

import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import {
  AlertController,
  NavController,
  LoadingController,
  PopoverController,
  IonicPage
} from "ionic-angular";
import { Platform } from "ionic-angular";
import {
  NativeGeocoder,
  NativeGeocoderReverseResult
} from "@ionic-native/native-geocoder";
import { LocationAccuracy } from "@ionic-native/location-accuracy";
import { Diagnostic } from "@ionic-native/diagnostic";
import { Toast } from "@ionic-native/toast";
import * as moment from "moment";
import { DeviceFeedback } from "@ionic-native/device-feedback";
import { Storage } from "@ionic/storage";

import { UserProvider } from "../../providers/user/user";
import { AttendanceProvider } from "../../providers/attendance/attendance";

declare let google: any;
declare let cordova: any;
@IonicPage()
@Component({
  selector: "page-attendance",
  templateUrl: "attendance.html"
})
export class AttendancePage {
  public form: FormGroup;
  attendance: {
    availability?: any;
    date?: string;
    time?: string;
    location?: string;
    status?: any;
    statuscolor?: any;
  } = {};
  tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  localISOTime = new Date(Date.now() - this.tzoffset)
    .toISOString()
    .slice(0, -1);
  curDateTime: String = moment(this.localISOTime).format(
    "MMMM Do, YYYY, h:mm:ss A"
  );
  AttendanceListDayPage = "AttendanceListDayPage";
  public currentDateTime: String;
  public staff: any;
  public key: any;
  public k: any;
  public streetname: any;
  public msg: any;
  public remarks: any;
  public availability: any;
  public accuracy: any;
  inisenabled: boolean = false;
  outisenabled: boolean = false;
  loader: any;
  public attCreate: any;
  public attCheck: any;
  splash: any;
  tabBarElement: any;
  status: any;
  allow: any;

  constructor(
    private toast: Toast,
    public platform: Platform,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public fb: FormBuilder,
    public user: UserProvider,
    public storage: Storage,
    public attend: AttendanceProvider,
    public geocoder: NativeGeocoder,
    public locac: LocationAccuracy,
    public popoverCtrl: PopoverController,
    private diagnostic: Diagnostic,
    private deviceFeedback: DeviceFeedback
  ) {
    this.tabBarElement = document.querySelector(".tabbar");
    this.form = this.fb.group({
      availability: ["", Validators.required]
    });
  }

  ionViewDidLoad() {
    this.tabBarElement.style.display = "none";
    this.status = localStorage.getItem("splashstatus");
    if (this.status === "true") {
      localStorage.setItem("splashstatus", "false");
      this.splash = true;
      setTimeout(() => {
        this.splash = false;
        this.tabBarElement.style.display = "flex";
      }, 4000);
    } else {
      this.splash = false;
      this.tabBarElement.style.display = "flex";
    }
  }

  ionViewWillEnter() {
    this.user.getUser().then(val => {
      this.staff = val;
      let staff_id = val.login;
      localStorage.setItem("id", staff_id);
      this.checkAttendance(staff_id);
    });
    this.resetFields();
  }

  resetFields(): void {
    this.attendance.availability = "";
    this.attendance.date = "";
    this.attendance.time = "";
    this.attendance.location = "";
    this.attendance.status = "";
    this.attendance.statuscolor = "";
  }

  punch(
    key: any,
    staff_id: any,
    punch_lat: any,
    punch_lon: any,
    punch_loc: any,
    availability: any,
    remarks: any
  ) {
    this.attend
      .createAttendance(
        key,
        staff_id,
        punch_lat,
        punch_lon,
        punch_loc,
        availability,
        remarks
      )
      .then(
        data => {
          this.attCreate = data;
          if (this.attCreate.status) {
            this.attendance.date = moment(this.attCreate.punch_time).format(
              "MMMM Do, YYYY"
            );
            this.attendance.time = moment(this.attCreate.punch_time).format(
              "h:mm:ss A"
            );
            this.currentDateTime =
              this.attendance.date + ", " + this.attendance.time;
            this.attendance.location = punch_loc;
            this.attendance.status =
              "Attendance has been recorded successfully. Your location detection has an accuracy of " +
              this.accuracy +
              " meters.";
            this.attendance.statuscolor = "green";
            if (key === "in") {
              this.alertError(
                `<h4><b>Congratulations!</b></h4><br/>You have successfully punched in.<br/><br/><u>Location:</u><br/>${this
                  .attendance
                  .location}<br/><br/><u>Server Date and Time:</u><br/>${this
                  .currentDateTime}`
              );
              this.inisenabled = true;
              this.outisenabled = true;
            } else if (key === "out") {
              this.alertError(
                `<h4><b>Congratulations!</b></h4><br/>You have successfully punched out.<br/><br/><u>Location:</u><br/>${this
                  .attendance
                  .location}<br/><br/><u>Server Date and Time:</u><br/>${this
                  .currentDateTime}`
              );
              this.inisenabled = false;
              this.outisenabled = false;
            }
          } else {
            this.attendance.status = "Error! Attendance cannot be recorded.";
            this.attendance.statuscolor = "red";
            this.alertError(
              `<h4><b>Error!</b></h4><br/>Something went wrong. Your attendance could not be recorded successfully.`
            );
          }
        },
        (error: any) => {
          console.log("There is no connection to the database server.");
          let msg =
            "Connection Error!\nThere is no connection to the database server. Please try again later.";
          this.sendNotification(msg);
        }
      );
    this.loader.dismiss();
  }

  checkAttendance(staff_id: any) {
    this.attend.retrieveTodayAttendance(staff_id).then(
      data => {
        this.attCheck = data;
        if (this.attCheck.user) {
          this.inisenabled = this.attCheck.in;
          this.outisenabled = this.attCheck.out;
        } else {
          this.inisenabled = this.attCheck.in;
          this.outisenabled = this.attCheck.out;
        }
        if (this.status === "true") {
          this.sendNotification(this.attCheck.message);
          this.status = "false";
        }
      },
      (error: any) => {
        console.log("There is no connection to the database server.");
        let msg =
          "Connection Error!\nThere is no connection to the database server. The punch in and punch out function will be disabled.";
        this.sendNotification(msg);
        this.inisenabled = false;
        this.outisenabled = false;
      }
    );
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

  presentPopover(event: Event) {
    this.deviceFeedback.acoustic();
    let popover = this.popoverCtrl.create("PopoverPage");
    popover.present({ ev: event });
  }

  click() {
    this.deviceFeedback.acoustic();
    this.navCtrl.push("AttendanceListDayPage");
  }

  geocodeLoc(lat: any, lon: any, loc: any) {
    let location: string;
    let latlon = new google.maps.LatLng(lat, lon);
    let geokod = new google.maps.Geocoder();
    geokod.geocode(
      {
        latLng: latlon
      },
      (responses: any) => {
        if (responses) {
          location = responses[0].formatted_address;
        } else {
          location = loc;
        }
        if (this.allow === true) {
          this.punch(
            this.key,
            this.staff.login,
            lat,
            lon,
            location,
            this.availability,
            this.remarks
          );
        } else {
          this.alertAttendance(lat, lon, location);
        }
      }
    );
  }

  requestPermission() {
    this.diagnostic.isLocationAuthorized().then(authorized => {
      if (authorized) {
        this.loader = this.loadingCtrl.create({
          content:
            "App has location authorization.<br>Detecting your location..."
        });

        this.loader.present().then(() => {
          this.geolocate();
        });
      } else {
        this.diagnostic.requestLocationAuthorization().then(status => {
          if (status == this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE) {
            this.loader = this.loadingCtrl.create({
              content:
                "Auth Status " +
                status +
                ".<br>App access " +
                status +
                ".<br>Detecting your location..."
            });
            this.loader.present().then(() => {
              this.geolocate();
            });
          } else {
            this.sendNotification("Cannot access location");
          }
        });
      }
    });
  }

  locationDetecting() {
    cordova.plugins.locationServices.geolocation.getCurrentPosition(
      function onSuccess(position: any) {
        localStorage.setItem("lat", position.coords.latitude);
        localStorage.setItem("lon", position.coords.longitude);
        localStorage.setItem("acc", position.coords.accuracy);
      },
      function onError(error: any) {
        localStorage.setItem("code", error.code);
        localStorage.setItem("msg", error.message);
      },
      {
        maximumAge: 0,
        timeout: 5000,
        enableHighAccuracy: true
      }
    );
  }

  geoload() {
    this.locationDetecting();
    setTimeout(() => {
      this.resetFields();
      if (
        localStorage.getItem("lat") === null ||
        localStorage.getItem("lon") === null
      ) {
        /*let err = localStorage.getItem("code");
        let msg = localStorage.getItem("msg");
        localStorage.removeItem("code");
        localStorage.removeItem("msg");
        this.msg =
          "Location cannot be detected. Please try again.";
        this.alertError(this.msg);
        this.loader.dismiss();*/
        this.geoload();
      } else {
        if (parseFloat(localStorage.getItem("acc")) > 20) {
          this.allow = false;
        } else {
          this.allow = true;
        }
        let lat = parseFloat(localStorage.getItem("lat"));
        let lon = parseFloat(localStorage.getItem("lon"));
        this.accuracy = parseFloat(localStorage.getItem("acc")).toFixed(2);
        localStorage.removeItem("lat");
        localStorage.removeItem("lon");
        localStorage.removeItem("acc");
        this.geocoder
          .reverseGeocode(lat, lon)
          .then((res: NativeGeocoderReverseResult) => {
            this.streetname =
              res.street +
              ", " +
              res.postalCode +
              ", " +
              res.city +
              ", " +
              res.countryName;
            this.geocodeLoc(lat, lon, this.streetname);
          });
      }
    }, 5000);
  }

  geolocate() {
    this.locac.canRequest().then((res: boolean) => {
      if (res) {
        this.locac.request(this.locac.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            this.platform.ready().then(() => {
              this.geoload();
            });
          },
          error => {
            this.msg = "Please turn on your GPS to use the selected function.";
            this.loader.dismiss();
            this.alertError(this.msg);
          }
        );
      }
    });
  }

  geolocateIn(form: NgForm) {
    this.deviceFeedback.acoustic();
    if (this.attendance.availability === "") {
      this.sendNotification("Please choose your availability.");
    } else {
      this.key = "in";
      this.availability = this.attendance.availability;
      if (this.attendance.availability === "outstation") {
        this.presentPrompt(this.key);
      } else if (this.attendance.availability === "onsite") {
        this.remarks = "Attendance Taken by SMART Attendance";
        this.confirmPunch(this.key);
      }
    }
  }

  geolocateOut(form: NgForm) {
    this.deviceFeedback.acoustic();
    if (this.attendance.availability === "") {
      this.sendNotification("Please choose your availability.");
    } else {
      this.key = "out";
      this.availability = this.attendance.availability;
      if (this.attendance.availability === "outstation") {
        this.presentPrompt(this.key);
      } else if (this.attendance.availability === "onsite") {
        this.remarks = "Attendance Taken by SMART Attendance";
        this.confirmPunch(this.key);
      }
    }
  }

  alertError(message: any) {
    let alert = this.alertCtrl.create({
      subTitle: message,
      buttons: [
        {
          text: "Dismiss",
          role: "cancel",
          handler: () => {
            console.log("Dismiss clicked");
            this.deviceFeedback.acoustic();
          }
        }
      ],
      cssClass: "alert"
    });
    alert.present();
  }

  alertAttendance(lat: any, lon: any, loc: any) {
    let alert = this.alertCtrl.create({
      title: "Attention!",
      message: `<br/>The location detected by the device is not accurate and will not be recorded. It requires your permission to allow this data to be stored as your attendance.<br/><br/><u>Accuracy:</u><br/>${this
        .accuracy} meters<br/><br/><u>Location:</u><br/>${loc}.<br/><br/>Click &lt;&lt;DISMISS&gt;&gt; to dismiss this dialog box and try again or click &lt;&lt;PROCEED&gt;&gt; to continue to PUNCH ${this.k} your attendance.`,
      buttons: [
        {
          text: "Dismiss",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
            this.deviceFeedback.acoustic();
            this.loader.dismiss();
          }
        },
        {
          text: "Proceed",
          handler: () => {
            console.log("Continue clicked");
            this.deviceFeedback.acoustic();
            this.punch(
              this.key,
              this.staff.login,
              lat,
              lon,
              loc,
              this.availability,
              this.remarks
            );
          }
        }
      ],
      cssClass: "alert"
    });
    alert.present();
  }

  confirmPunch(key: any) {
    if (key == "in") this.k = "IN";
    else this.k = "OUT";
    let alert = this.alertCtrl.create({
      title: "PUNCH " + this.k,
      subTitle: "Are you sure?",
      buttons: [
        {
          text: "Back",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
            this.deviceFeedback.acoustic();
          }
        },
        {
          text: "Continue",
          handler: () => {
            console.log("Continue clicked");
            this.deviceFeedback.acoustic();
            this.requestPermission();
          }
        }
      ],
      cssClass: "alert"
    });
    alert.present();
  }

  presentPrompt(key: any) {
    let alert = this.alertCtrl.create({
      title: "Remarks",
      inputs: [
        {
          name: "remarks",
          placeholder: "Please specify...",
          type: "text"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: data => {
            console.log("Cancel clicked");
            this.deviceFeedback.acoustic();
          }
        },
        {
          text: "Continue",
          handler: data => {
            this.deviceFeedback.acoustic();
            if (data.remarks !== "") {
              this.remarks = data.remarks;
              this.confirmPunch(key);
            } else {
              this.sendNotification("Please input remarks!");
            }
          }
        }
      ],
      cssClass: "alert"
    });
    alert.present();
  }
}

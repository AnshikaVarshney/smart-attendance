import { Component } from "@angular/core";
import { NavParams, LoadingController, IonicPage } from "ionic-angular";
import * as moment from "moment";

@IonicPage()
@Component({
  selector: "page-attendance-view",
  templateUrl: "attendance-view.html"
})
export class AttendanceViewPage {
  public attendanceDateTime: any;
  public attendanceLat: any;
  public attendanceLon: any;
  public attendanceLoc: any;
  public attendanceRemarks: any;
  public pageTitle: string;

  constructor(public NP: NavParams, public loadingCtrl: LoadingController) {}

  ionViewWillEnter() {
    this.resetFields();
    let loader = this.loadingCtrl.create({
      content: "Loading..."
    });
    loader.present().then(() => {
      if (this.NP.get("record")) {
        this.selectEntry(this.NP.get("record"));
        this.pageTitle = "My Attendance Details";
      }
      loader.dismiss();
    });
  }

  selectEntry(item: any) {
    this.attendanceDateTime = moment(item.punch_time).format(
      "MMMM Do, YYYY, h:mm:ss A"
    );
    this.attendanceLat = item.punch_lat;
    this.attendanceLon = item.punch_lon;
    this.attendanceLoc = item.punch_loc;
    this.attendanceRemarks = item.remarks;
  }

  resetFields(): void {
    this.attendanceLat = "";
    this.attendanceLon = "";
    this.attendanceLoc = "";
    this.attendanceRemarks = "";
  }
}

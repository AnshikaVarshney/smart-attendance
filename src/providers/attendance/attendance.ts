import { Injectable } from "@angular/core";
import {
  Http,
  Headers,
  Response,
  Request,
  RequestOptions,
  RequestMethod
} from "@angular/http";
import { Events } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";

@Injectable()
export class AttendanceProvider {
  private apiUrl = "http://175.138.67.12/SMARTAttendance_0.3/api/attendance/";
  private data: any;

  constructor(
    public http: Http,
    public events: Events,
    public storage: Storage
  ) {
    this.initializeData();
  }

  initializeData() {
    this.data = null;
  }

  retrieveAttendanceByTime(
    staff_id: any,
    selectedDate: any
  ): Observable<string[]> {
    let body: string =
        "key=list&staff_id=" + staff_id + "&curdate=" + selectedDate,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ "Content-Type": type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + "retrieve-attendance-time.php";

    return this.http
      .post(url, body, options)
      .timeout(5000)
      .map(res => res.json())
      .catch(this.handleError);
  }

  retrieveAttendanceByDay(staff_id: any): Observable<string[]> {
    let body: string = "key=list&staff_id=" + staff_id,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ "Content-Type": type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + "retrieve-attendance-day.php";

    return this.http
      .post(url, body, options)
      .timeout(5000)
      .map(res => res.json())
      .catch(this.handleError);
  }

  retrieveAttendanceByDayAll(staff_id: any): Observable<string[]> {
    let body: string = "key=all&staff_id=" + staff_id,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ "Content-Type": type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + "retrieve-attendance-day.php";

    return this.http
      .post(url, body, options)
      .timeout(5000)
      .map(res => res.json())
      .catch(this.handleError);
  }

  retrieveAttendanceByDayScroll(staff_id: any, start: any): Observable<string[]> {
    let body: string = "key=scroll&staff_id=" + staff_id + "&start=" + start,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ "Content-Type": type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + "retrieve-attendance-day.php";

    return this.http
      .post(url, body, options)
      .timeout(5000)
      .map(res => res.json())
      .catch(this.handleError);
  }

  retrieveTodayAttendance(staff_id: any) {
    this.initializeData();
    let body: string = "staff_id=" + staff_id,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ "Content-Type": type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + "retrieve-today-attendance.php";

    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.http
        .post(url, body, options)
        .timeout(5000)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  createAttendance(
    key: any,
    staff_id: any,
    punch_lat: any,
    punch_lon: any,
    punch_loc: any,
    availability: any,
    remarks: any
  ) {
    this.initializeData();
    let body: string =
        "key=" +
        key +
        "&staff_id=" +
        staff_id +
        "&availability=" +
        availability +
        "&remarks=" +
        remarks +
        "&punch_lat=" +
        punch_lat +
        "&punch_lon=" +
        punch_lon +
        "&punch_loc=" +
        punch_loc,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ "Content-Type": type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + "manage-attendance.php";

    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.http
        .post(url, body, options)
        .timeout(5000)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || "";
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}

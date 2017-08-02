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
export class UserProvider {
  private apiUrl = "http://175.138.67.12/SMARTAttendance_0.3/api/user/";
  private data: any;

  HAS_LOGGED_IN = "hasLoggedIn";
  HAS_SEEN_TUTORIAL = "hasSeenTutorial";

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

  userLogin(
    staff_id: any,
    password: any,
    model: any,
    platform: any,
    uuid: any,
    version: any,
    manufacturer: any,
    serial: any
  ) {
    this.initializeData();
    let body: string =
        "staff_id=" +
        staff_id +
        "&password=" +
        password +
        "&model=" +
        model +
        "&platform=" +
        platform +
        "&uuid=" +
        uuid +
        "&version=" +
        version +
        "&manufacturer=" +
        manufacturer +
        "&serial_no=" +
        serial,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ "Content-Type": type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + "securelogin.php";

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

  userCheck(staff_id: any, password: any, email: any) {
    this.initializeData();
    let body: string =
        "staff_id=" + staff_id + "&password=" + password + "&email=" + email,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ "Content-Type": type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + "retrieve-user.php";

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

  passwordReset(staff_id: any) {
    this.initializeData();
    let body: string = "staff_id=" + staff_id,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ "Content-Type": type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + "resetpassword.php";

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

  passwordUpdate(staff_id: any, password: any) {
    this.initializeData();
    let body: string = "staff_id=" + staff_id + "&password=" + password,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ "Content-Type": type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + "updatepassword.php";

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

  login(data: any): void {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUser(data);
  }

  logout(): void {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove("user");
    localStorage.clear();
  }

  setUser(data: any): void {
    this.storage.set("user", data);
  }

  getUser(): Promise<any> {
    return this.storage.get("user").then(value => {
      return value;
    });
  }

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then(value => {
      return value === true;
    });
  }

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then(value => {
      return value;
    });
  }
}

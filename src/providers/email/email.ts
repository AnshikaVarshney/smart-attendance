import { Injectable } from "@angular/core";
import {
  Http,
  Headers,
  Request,
  RequestOptions,
  RequestMethod
} from "@angular/http";
import { NavController, LoadingController } from "ionic-angular";
import { Events } from "ionic-angular";
import { Storage } from "@ionic/storage";

@Injectable()
export class EmailProvider {
  subject: string = "";
  from: string = "";
  name: string = "";
  staff_id: string = "";
  loader: any;
  private apiUrl = "http://175.138.67.12/SMARTAttendance_0.3/api/email/";

  constructor(
    public http: Http,
    public events: Events,
    public storage: Storage
  ) {
    this.http = http;
  }
  
  emailSupportMessage(
    category: any,
    message: any,
    from: any,
    staff_id: any,
    name: any
  ) {
    this.subject = "| Support - SMARTLA / SMARTA |";
    let msg: string =
      "<br>" +
      "Support Email<br>" +
      "<br>" +
      "Category:<br>" +
      category +
      "<br>" +
      "<br>" +
      "------------------------------------------------------------------------------------------------<br>" +
      "Message:<br>" +
      message +
      "<br>" +
      "------------------------------------------------------------------------------------------------<br>" +
      "<br>" +
      "Regards, <br>" +
      staff_id +
      "<br>" +
      name +
      "<br>";
    var requestHeaders = new Headers();
    requestHeaders.append(
      "Content-Type",
      "application/x-www-form-urlencoded; charset=UTF-8"
    );
    let options = new RequestOptions({
      method: RequestMethod.Post,
      url: this.apiUrl + "sendmail.php",
      body:
        "key=support&from=" +
        from +
        "&to=&subject=" +
        this.subject +
        "&message=" +
        msg +
        "&name=" +
        name,
      headers: requestHeaders
    });
    return this.http.request(new Request(options));
  }

  emailDeviceResetAdmin(data: any) {
    this.subject = "| Request Reset Device ID - SMARTLA / SMARTA |";
    let msgAdmin: string =
      "<br>" +
      "Request Reset Device ID<br>" +
      "<br>" +
      "------------------------------------------------------------------------------------------------<br>" +
      "User " +
      data.user.login +
      ", has requested for the reset of Device ID<br>" +
      "Date and Time: " +
      data.date +
      ".<br>" +
      "------------------------------------------------------------------------------------------------<br>" +
      "<br>" +
      "Regards, <br>" +
      data.user.login +
      "<br>" +
      data.user.firstname +
      " " +
      data.user.lastname +
      "<br>" +
      data.user.email +
      "<br>";
    this.name = data.user.firstname + " " + data.user.lastname;
    var requestHeaders = new Headers();
    requestHeaders.append(
      "Content-Type",
      "application/x-www-form-urlencoded; charset=UTF-8"
    );
    let options = new RequestOptions({
      method: RequestMethod.Post,
      url: this.apiUrl + "sendmail.php",
      body:
        "key=devicea&from=" +
        data.user.email +
        "&to=&subject=" +
        this.subject +
        "&message=" +
        msgAdmin +
        "&name=" +
        this.name,
      headers: requestHeaders
    });
    return this.http.request(new Request(options));
  }

  emailDeviceResetUser(data: any) {
    this.subject = "| Request Reset Device ID - SMARTLA / SMARTA |";
    let msgUser: string =
      "<br>" +
      "You have requested for Device ID Reset on " +
      data.date +
      "!<br>" +
      "If you did not make this request, please contact the administrator immediately.<br>" +
      "<br>Regards, <br>SMARTLA/SMARTA Administrator<br><br>";
    this.name = data.user.firstname + " " + data.user.lastname;
    var requestHeaders = new Headers();
    requestHeaders.append(
      "Content-Type",
      "application/x-www-form-urlencoded; charset=UTF-8"
    );
    let options = new RequestOptions({
      method: RequestMethod.Post,
      url: this.apiUrl + "sendmail.php",
      body:
        "key=deviceb&from=&to=" +
        data.user.email +
        "&subject=" +
        this.subject +
        "&message=" +
        msgUser +
        "&name=" +
        this.name,
      headers: requestHeaders
    });
    return this.http.request(new Request(options));
  }

  emailPasswordUpdate(recipient: string, date: string, name: string) {
    this.subject = "| Update Password - SMARTLA / SMARTA |";
    let message: string =
      "<br>" +
      "Your password has been updated on " +
      date +
      "!<br>" +
      "If you did not make this changes, please contact the administrator immediately.<br>" +
      "<br>" +
      "Regards, <br>" +
      "SMARTLA/SMARTA Administrator<br>" +
      "<br>";
    var requestHeaders = new Headers();
    requestHeaders.append(
      "Content-Type",
      "application/x-www-form-urlencoded; charset=UTF-8"
    );
    let options = new RequestOptions({
      method: RequestMethod.Post,
      url: this.apiUrl + "sendmail.php",
      body:
        "key=update&from=&to=" +
        recipient +
        "&subject=" +
        this.subject +
        "&message=" +
        message +
        "&name=" +
        name,
      headers: requestHeaders
    });
    return this.http.request(new Request(options));
  }

  emailPasswordForgot(
    recipient: string,
    token: string,
    name: string,
    msg: string
  ) {
    this.subject = "| Reset Password - SMARTLA / SMARTA |";
    let message: string =
      "<br>" +
      "Your password will be reset!<br>" +
      "If you did not make this request, you can just ignore this email.<br>" +
      "<br>" +
      "------------------------------------------------------------------------------------------------<br>" +
      "Please click this link to reset your password:<br>" +
      "http://175.138.67.12/SMARTLA/password/reset/" +
      token +
      "<br>" +
      "------------------------------------------------------------------------------------------------<br>" +
      "<br>" +
      "The links above will expire in approximately 15 minutes from the time you received this email.<br>" +
      "<br>" +
      "Regards, <br>" +
      "SMARTLA/SMARTA Administrator<br>" +
      "<br>";
    var requestHeaders = new Headers();
    requestHeaders.append(
      "Content-Type",
      "application/x-www-form-urlencoded; charset=UTF-8"
    );
    let options = new RequestOptions({
      method: RequestMethod.Post,
      url: this.apiUrl + "sendmail.php",
      body:
        "key=reset&from=&to=" +
        recipient +
        "&subject=" +
        this.subject +
        "&message=" +
        message +
        "&name=" +
        name,
      headers: requestHeaders
    });
    return this.http.request(new Request(options));
  }
}

import { Component } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import {
  AlertController,
  NavController,
  LoadingController,
  IonicPage
} from "ionic-angular";
import { Toast } from "@ionic-native/toast";
import { DeviceFeedback } from "@ionic-native/device-feedback";
import { UserProvider } from "../../providers/user/user";
import { EmailProvider } from "../../providers/email/email";

@IonicPage()
@Component({
  selector: "page-support-front",
  templateUrl: "support-front.html"
})
export class SupportFrontPage {
  public form: FormGroup;
  name: string = "";
  user: { staff_id?: any; password?: any; email?: any } = {};
  loader: any;
  public userCheck: any;

  constructor(
    public userData: UserProvider,
    public emailSender: EmailProvider,
    private toast: Toast,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public fb: FormBuilder,
    private deviceFeedback: DeviceFeedback
  ) {
    this.form = fb.group({
      staff_id: ["", Validators.required],
      password: ["", Validators.required],
      email: ["", Validators.required]
    });
  }

  ionViewWillEnter() {
    this.resetFields();
  }

  resetFields(): void {
    this.user.staff_id = "";
    this.user.password = "";
    this.user.email = "";
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

  saveEntry() {
    this.deviceFeedback.acoustic();

    let staff_id: string = this.form.controls["staff_id"].value,
      password: string = this.form.controls["password"].value,
      email: string = this.form.controls["email"].value;

    this.loader = this.loadingCtrl.create({
      content: "Requesting..."
    });

    this.loader.present().then(() => {
      this.checkUser(staff_id, password, email);
    });
  }

  checkUser(staff_id: any, password: any, email: any) {
    this.userData.userCheck(staff_id, password, email).then(
      data => {
        this.userCheck = data;
        if (this.userCheck.user) {
          console.log(this.userCheck.message);
          this.send(this.userCheck);
        } else {
          this.sendNotification(this.userCheck.message);
          this.loader.dismiss();
        }
      },
      (error: any) => {
        console.log("There is no connection to the database server.");
        let msg =
          "Reset Device ID Request Failed!\nThere is no connection to the database server. Please try again later.";
        this.sendNotification(msg);
        this.loader.dismiss();
      }
    );
  }

  sendEmailToAdmin(data: any) {
    this.emailSender.emailDeviceResetAdmin(data).subscribe(
      success => {
        console.log("SUCCESS -> " + JSON.stringify(success));
        this.sendEmailToUser(data);
      },
      error => {
        console.log("ERROR -> " + JSON.stringify(error));
        let msg =
          "Reset Device ID Request Failed!\nThere is no connection to the database server. Please try again later.";
        this.sendNotification(msg);
        this.loader.dismiss();
      }
    );
  }

  sendEmailToUser(data: any) {
    this.emailSender.emailDeviceResetUser(data).subscribe(
      success => {
        console.log("SUCCESS -> " + JSON.stringify(success));
        this.sendNotification(
          "Thank you. Your request has been sent to the admin."
        );
        this.loader.dismiss();
        this.navCtrl.pop();
      },
      error => {
        console.log("ERROR -> " + JSON.stringify(error));
        let msg =
          "Reset Device ID Request Failed!\nThere is no connection to the database server. Please try again later.";
        this.sendNotification(msg);
        this.loader.dismiss();
      }
    );
  }

  send(data: any) {
    let alert = this.alertCtrl.create({
      title: "Request Device ID Reset",
      subTitle: "Are you sure?",
      buttons: [
        {
          text: "Back",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
            this.deviceFeedback.acoustic();
            this.loader.dismiss();
          }
        },
        {
          text: "Continue",
          handler: () => {
            console.log("Continue clicked");
            this.deviceFeedback.acoustic();
            this.sendEmailToAdmin(data);
          }
        }
      ],
      cssClass: "alert"
    });
    alert.present();
  }
}

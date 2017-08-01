import { Component } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { NavController, LoadingController, IonicPage } from "ionic-angular";
import { UserProvider } from "../../providers/user/user";
import { EmailProvider } from "../../providers/email/email";
import { Toast } from "@ionic-native/toast";
import { DeviceFeedback } from "@ionic-native/device-feedback";

@IonicPage()
@Component({
  selector: "page-user",
  templateUrl: "signup.html"
})
export class SignupPage {
  private token: string;
  public form: FormGroup;
  public resetStaff_id: any;
  SignupPage = SignupPage;
  loader: any;
  public reset: any;

  constructor(
    private toast: Toast,
    public navCtrl: NavController,
    public fb: FormBuilder,
    public loadingCtrl: LoadingController,
    public userData: UserProvider,
    public emailSender: EmailProvider,
    private deviceFeedback: DeviceFeedback
  ) {
    this.form = fb.group({
      staff_id: ["", Validators.required]
    });
  }

  ionViewWillEnter() {
    this.resetFields();
  }

  send(recipient: string, token: string, name: string, msg: string) {
    this.emailSender
      .emailPasswordForgot(recipient, token, name, msg)
      .subscribe(
        success => {
          console.log("SUCCESS -> " + JSON.stringify(success));
          this.sendNotification(msg);
          this.loader.dismiss();
          this.navCtrl.setRoot("LoginPage");
        },
        error => {
          console.log("ERROR -> " + JSON.stringify(error));
          this.sendNotification(
            "Error! Your request can't be performed. Please try again later."
          );
          this.loader.dismiss();
        }
      );
  }

  saveEntry() {
    this.deviceFeedback.acoustic();
    let staff_id: string = this.form.controls["staff_id"].value;

    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });

    this.loader.present().then(() => {
      this.onReset(staff_id);
    });
  }

  resetFields(): void {
    this.resetStaff_id = "";
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

  onReset(staff_id: any) {
    this.userData.passwordReset(staff_id).then(
      data => {
        this.reset = data;
        if (this.reset.user) {
          this.token = this.reset.token;
          this.send(
            this.reset.data.email,
            this.token,
            this.reset.data.firstname + " " + this.reset.data.lastname,
            this.reset.message
          );
        } else {
          this.sendNotification(this.reset.message);
          this.resetFields();
          this.loader.dismiss();
        }
      },
      (error: any) => {
        console.log("There is no connection to the database server.");
        let msg =
          "Reset Password Request Failed!\nThere is no connection to the database server. Please try again later.";
        this.sendNotification(msg);
        this.loader.dismiss();
      }
    );
  }
}

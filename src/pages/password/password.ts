import { Component } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import {
  NavController,
  AlertController,
  LoadingController,
  IonicPage
} from "ionic-angular";
import { UserProvider } from "../../providers/user/user";
import { EmailProvider } from "../../providers/email/email";
import { Toast } from "@ionic-native/toast";
import { DeviceFeedback } from "@ionic-native/device-feedback";

@IonicPage()
@Component({
  selector: "page-password",
  templateUrl: "password.html"
})
export class PasswordPage {
  public form: FormGroup;
  public password: any;
  public confpassword: any;
  public staff_id: any;
  public email: any;
  public name: any;
  loader: any;
  public update: any;

  constructor(
    private toast: Toast,
    public navCtrl: NavController,
    public fb: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public userData: UserProvider,
    public emailSender: EmailProvider,
    private deviceFeedback: DeviceFeedback
  ) {
    this.form = fb.group({
      password: ["", Validators.required],
      confpassword: ["", Validators.required]
    });
  }

  ionViewWillEnter() {
    this.resetFields();
    this.userData.getUser().then(val => {
      this.staff_id = val.login;
      this.email = val.email;
      this.name = val.firstname + " " + val.lastname;
    });
  }

  confirmUpdate(password: any) {
    let alert = this.alertCtrl.create({
      title: "Update Password",
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
            this.loader = this.loadingCtrl.create({
              content: "Updating..."
            });

            this.loader.present().then(() => {
              this.onUpdate(this.staff_id, password);
            });
          }
        }
      ],
      cssClass: "alert"
    });
    alert.present();
  }

  saveEntry() {
    this.deviceFeedback.acoustic();
    let password: string = this.form.controls["password"].value;
    let confpassword: string = this.form.controls["confpassword"].value;
    if (password !== confpassword) {
      this.resetFields();
      this.sendNotification("Passwords do not matched! Please enter again.");
    } else {
      this.confirmUpdate(password);
    }
  }

  resetFields(): void {
    this.password = "";
    this.confpassword = "";
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

  send(recipient: string, message: string, name: string) {
    this.emailSender.emailPasswordUpdate(recipient, message, name).subscribe(
      success => {
        console.log("SUCCESS -> " + JSON.stringify(success));
      },
      error => {
        console.log("ERROR -> " + JSON.stringify(error));
      }
    );
  }

  onUpdate(staff_id: any, password: any) {
    this.userData.passwordUpdate(staff_id, password).then(
      data => {
        this.update = data;
        if (this.update.status) {
          this.send(this.email, this.update.date, this.name);
          this.sendNotification(this.update.message);
          this.loader.dismiss();
          this.navCtrl.pop();
        } else {
          this.sendNotification(this.update.message);
          this.loader.dismiss();
          this.navCtrl.pop();
        }
      },
      (error: any) => {
        console.log("There is no connection to the database server.");
        let msg =
          "Update Password Failed!\nThere is no connection to the database server. Please try again later.";
        this.sendNotification(msg);
        this.loader.dismiss();
      }
    );
  }
}

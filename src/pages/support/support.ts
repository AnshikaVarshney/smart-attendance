import { Component } from "@angular/core";
import {
  AlertController,
  NavController,
  LoadingController,
  IonicPage
} from "ionic-angular";
import { UserProvider } from "../../providers/user/user";
import { EmailProvider } from "../../providers/email/email";
import { Toast } from "@ionic-native/toast";
import { DeviceFeedback } from "@ionic-native/device-feedback";

@IonicPage()
@Component({
  selector: "page-support",
  templateUrl: "support.html"
})
export class SupportPage {
  from: string = "";
  category: string = "";
  message: string = "";
  name: string = "";
  staff_id: string = "";
  loader: any;

  constructor(
    private toast: Toast,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public user: UserProvider,
    public emailSender: EmailProvider,
    private deviceFeedback: DeviceFeedback
  ) {
    this.user.getUser().then(val => {
      this.from = val.email;
      this.name = val.firstname + " " + val.lastname;
      this.staff_id = val.login;
    });
    this.category = "";
    this.message = "";
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

  sendEmail(category: string, message: string) {
    this.emailSender.emailSupportMessage(category, message, this.from, this.staff_id, this.name).subscribe(
      success => {
        console.log("SUCCESS -> " + JSON.stringify(success));
        this.sendNotification(
          "Thank you. Your message has been sent to the support."
        );
        this.loader.dismiss();
        this.navCtrl.pop();
      },
      error => {
        console.log("ERROR -> " + JSON.stringify(error));
        let msg =
          "Message Sending Failed!\nThere is no connection to the database server. Please try again later.";
        this.sendNotification(msg);
        this.loader.dismiss();
      }
    );
  }

  send(category: string, message: string) {
    this.deviceFeedback.acoustic();
    if (category == "") {
      this.sendNotification("Please choose category.");
    } else if (message == "") {
      this.sendNotification("Please enter your message.");
    } else {
      let alert = this.alertCtrl.create({
        title: "Send Support Email",
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
                content: "Sending..."
              });
              this.loader.present().then(() => {
                this.sendEmail(category, message);
              });
            }
          }
        ],
        cssClass: "alert"
      });
      alert.present();
    }
  }
}

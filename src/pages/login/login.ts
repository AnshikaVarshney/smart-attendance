import { Component } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import {
  NavController,
  LoadingController,
  PopoverController,
  IonicPage
} from "ionic-angular";
import { Device } from "@ionic-native/device";
import { UserProvider } from "../../providers/user/user";
import { Toast } from "@ionic-native/toast";
import { DeviceFeedback } from "@ionic-native/device-feedback";
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: "page-user",
  templateUrl: "login.html"
})
export class LoginPage {
  public form: FormGroup;
  public loginStaff_id: any;
  public loginPassword: any;
  SignupPage = "SignupPage";
  private model: any;
  private platform: any;
  private uuid: any;
  private version: any;
  private manufacturer: any;
  private serial: any;
  loader: any;
  public loginData: any;
  splash: any;

  constructor(
    private toast: Toast,
    public navCtrl: NavController,
    public fb: FormBuilder,
    public loadingCtrl: LoadingController,
    public popoverCtrl: PopoverController,
    public storage: Storage,
    public userData: UserProvider,
    private dev: Device,
    private deviceFeedback: DeviceFeedback
  ) {
    this.form = fb.group({
      staff_id: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  ionViewDidLoad() {
    let status = localStorage.getItem("splashstatus");
    if (status === "true") {
      localStorage.setItem("splashstatus", "false");
      this.splash = true;
      setTimeout(() => {
        this.splash = false;
      }, 5000);
    } else {
      this.splash = false;
    }
  }

  ionViewWillEnter() {
    this.resetFields();
    if (this.dev.uuid != null) {
      this.model = this.dev.model;
      this.platform = this.dev.platform;
      this.uuid = this.dev.uuid;
      this.version = this.dev.version;
      this.manufacturer = this.dev.manufacturer;
      this.serial = this.dev.serial;
    } else {
      this.model = "";
      this.platform = "";
      this.uuid = "";
      this.version = "";
      this.manufacturer = "";
      this.serial = "";
    }
  }

  presentPopover(event: Event) {
    let popover = this.popoverCtrl.create("PopoverFrontPage");
    popover.present({ ev: event });
  }

  saveEntry() {
    this.deviceFeedback.acoustic();
    let staff_id: string = this.form.controls["staff_id"].value,
      password: string = this.form.controls["password"].value;

    this.loader = this.loadingCtrl.create({
      content: "Logging in..."
    });

    this.loader.present().then(() => {
      this.onLogin(staff_id, password);
    });
  }

  resetFields(): void {
    this.loginStaff_id = "";
    this.loginPassword = "";
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

  onLogin(staff_id: any, password: any) {
    this.userData
      .userLogin(
        staff_id,
        password,
        this.model,
        this.platform,
        this.uuid,
        this.version,
        this.manufacturer,
        this.serial
      )
      .then(
        data => {
          this.loginData = data;
          if (this.loginData.user) {
            this.userData.login(this.loginData.user);
            this.loader.dismiss();
            this.navCtrl.setRoot("TabsPage");
          } else {
            this.sendNotification(this.loginData.message);
            this.loader.dismiss();
            this.navCtrl.setRoot("LoginPage");
          }
        },
        (error: any) => {
          console.log("There is no connection to the database server.");
          let msg =
            "Login Failed!\nThere is no connection to the database server. Please try again later.";
          this.sendNotification(msg);
          this.loader.dismiss();
        }
      );
  }

  click() {
    this.deviceFeedback.acoustic();
    this.navCtrl.push("SignupPage");
  }
}

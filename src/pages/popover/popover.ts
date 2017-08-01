import { Component } from '@angular/core';
import { ViewController, App, AlertController, LoadingController, IonicPage } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { DeviceFeedback } from '@ionic-native/device-feedback';

@IonicPage()
@Component({
  template: `
    <ion-list>
      <button ion-item (tap)="faq()">FAQ</button>
      <button ion-item (tap)="support()">Support</button>
      <button ion-item (tap)="logout(true)">Logout</button>
    </ion-list>
  `
})
export class PopoverPage {
  constructor(
    public userData: UserProvider,
    public viewCtrl: ViewController,
    public app: App,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private deviceFeedback: DeviceFeedback
  ) { }

  faq() {
    this.deviceFeedback.acoustic();
    this.viewCtrl.dismiss().then(() => {
      this.app.getRootNav().push('FAQPage');
    });
  }

  support() {
    this.deviceFeedback.acoustic();
    this.viewCtrl.dismiss().then(() => {
      this.app.getRootNav().push('SupportPage');
    });
  }

  logout(boolean: true) {
    this.deviceFeedback.acoustic();
    this.confirmLogout();
    this.viewCtrl.dismiss();
  }

  confirmLogout() {
    let alert = this.alertCtrl.create({
      title: 'Logout',
      subTitle: 'Are you sure?',
      buttons: [
        {
          text: 'Back',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.deviceFeedback.acoustic();
          }
        },
        {
          text: 'Continue',
          handler: () => {
            console.log('Continue clicked');
            this.deviceFeedback.acoustic();
            let loader = this.loadingCtrl.create({
              content: 'Logging out...',
            });

            loader.present().then(() => {
              this.userData.logout();
              this.viewCtrl.dismiss().then(() => {
                this.app.getRootNav().push('LoginPage');
                this.app.getRootNav().setRoot('LoginPage');
              }); 
              loader.dismiss();
            });
          }
        }
      ],
      cssClass: 'alert'
    });
    alert.present();
  }

  close(url: string) {
    window.open(url, '_blank');
    this.viewCtrl.dismiss();
  }
}
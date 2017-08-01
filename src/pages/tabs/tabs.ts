import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { DeviceFeedback } from '@ionic-native/device-feedback';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = 'AttendancePage';
  tab2Root: any = 'AccountPage';
  tab3Root: any = 'AboutPage';
  mySelectedIndex: number;

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    private deviceFeedback: DeviceFeedback) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

  changeTab() {
    this.deviceFeedback.acoustic();
  }
}

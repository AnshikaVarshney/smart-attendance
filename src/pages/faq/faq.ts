import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { DeviceFeedback } from '@ionic-native/device-feedback';

@IonicPage()
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html'
})
export class FAQPage {
  public pageTitle: string;
  public buttonClicked1: boolean = false;
  public buttonClicked11: boolean = false;
  public buttonClicked12: boolean = false;
  public buttonClicked13: boolean = false;
  public buttonClicked14: boolean = false;
  public buttonClicked15: boolean = false;
  public buttonClicked2: boolean = false;
  public buttonClicked3: boolean = false;

  constructor(private deviceFeedback: DeviceFeedback) { }

  ionViewWillEnter() {
    this.pageTitle = 'Frequently Asked Questions';
  }

  onButtonClick1() {
    this.deviceFeedback.acoustic();
    this.buttonClicked1 = !this.buttonClicked1;
  }

  onButtonClick11() {
    this.deviceFeedback.acoustic();
    this.buttonClicked11 = !this.buttonClicked11;
  }

  onButtonClick12() {
    this.deviceFeedback.acoustic();
    this.buttonClicked12 = !this.buttonClicked12;
  }

  onButtonClick13() {
    this.deviceFeedback.acoustic();
    this.buttonClicked13 = !this.buttonClicked13;
  }

  onButtonClick14() {
    this.deviceFeedback.acoustic();
    this.buttonClicked14 = !this.buttonClicked14;
  }

  onButtonClick15() {
    this.deviceFeedback.acoustic();
    this.buttonClicked15 = !this.buttonClicked15;
  }

  onButtonClick2() {
    this.deviceFeedback.acoustic();
    this.buttonClicked2 = !this.buttonClicked2;
  }

  onButtonClick3() {
    this.deviceFeedback.acoustic();
    this.buttonClicked3 = !this.buttonClicked3;
  }
}
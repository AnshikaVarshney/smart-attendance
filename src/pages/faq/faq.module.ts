import { NgModule } from '@angular/core';
import { FAQPage } from './faq';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [FAQPage],
  imports: [IonicPageModule.forChild(FAQPage)],
  entryComponents: [FAQPage]
})
export class FAQPageModule { }

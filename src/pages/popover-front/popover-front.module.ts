import { NgModule } from '@angular/core';
import { PopoverFrontPage } from './popover-front';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [PopoverFrontPage],
  imports: [IonicPageModule.forChild(PopoverFrontPage)],
  entryComponents: [PopoverFrontPage]
})
export class PopoverFrontPageModule { }

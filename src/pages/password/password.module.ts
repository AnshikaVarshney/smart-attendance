import { NgModule } from '@angular/core';
import { PasswordPage } from './password';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [PasswordPage],
  imports: [IonicPageModule.forChild(PasswordPage)],
  entryComponents: [PasswordPage]
})
export class PasswordPageModule { }

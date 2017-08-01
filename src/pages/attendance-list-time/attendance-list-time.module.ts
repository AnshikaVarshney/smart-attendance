import { NgModule } from '@angular/core';
import { AttendanceListTimePage } from './attendance-list-time';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [AttendanceListTimePage],
  imports: [IonicPageModule.forChild(AttendanceListTimePage)],
  entryComponents: [AttendanceListTimePage]
})
export class AttendanceListTimePageModule { }

import { NgModule } from "@angular/core";
import { AttendanceListDayPage } from "./attendance-list-day";
import { IonicPageModule } from "ionic-angular";

@NgModule({
  declarations: [AttendanceListDayPage],
  imports: [IonicPageModule.forChild(AttendanceListDayPage)],
  entryComponents: [AttendanceListDayPage]
})
export class AttendanceListDayPageModule {}

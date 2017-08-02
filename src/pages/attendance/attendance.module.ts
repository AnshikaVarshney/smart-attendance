import { NgModule } from "@angular/core";
import { AttendancePage } from "./attendance";
import { IonicPageModule } from "ionic-angular";

@NgModule({
  declarations: [AttendancePage],
  imports: [IonicPageModule.forChild(AttendancePage)],
  entryComponents: [AttendancePage]
})
export class AttendancePageModule {}

import { NgModule } from "@angular/core";
import { AttendanceViewPage } from "./attendance-view";
import { IonicPageModule } from "ionic-angular";

@NgModule({
  declarations: [AttendanceViewPage],
  imports: [IonicPageModule.forChild(AttendanceViewPage)],
  entryComponents: [AttendanceViewPage]
})
export class AttendanceViewPageModule {}

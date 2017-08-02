import { NgModule } from "@angular/core";
import { SupportFrontPage } from "./support-front";
import { IonicPageModule } from "ionic-angular";

@NgModule({
  declarations: [SupportFrontPage],
  imports: [IonicPageModule.forChild(SupportFrontPage)],
  entryComponents: [SupportFrontPage]
})
export class SupportFrontPageModule {}

import { NgModule } from "@angular/core";
import { MapViewPage } from "./map-view";
import { IonicPageModule } from "ionic-angular";

@NgModule({
  declarations: [MapViewPage],
  imports: [IonicPageModule.forChild(MapViewPage)],
  entryComponents: [MapViewPage]
})
export class MapViewPageModule {}

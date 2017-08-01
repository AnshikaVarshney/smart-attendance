import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavParams, LoadingController, IonicPage } from 'ionic-angular';
import { DeviceFeedback } from '@ionic-native/device-feedback';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-map-view',
  templateUrl: 'map-view.html'
})
export class MapViewPage {
  public lat: any;
  public lon: any;
  public loc: any;
  @ViewChild('map') mapElement: ElementRef;
  constructor(private navParams: NavParams,
    public loadingCtrl: LoadingController,
    private deviceFeedback: DeviceFeedback) {
    if (this.navParams.get("record")) {
      this.selectEntry(this.navParams.get("record"));
    }
  }

  selectEntry(item: any) {
    this.lat = item.punch_lat;
    this.lon = item.punch_lon;
    this.loc = item.punch_loc;
  }

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      content: 'Loading...',
    });
    loader.present().then(() => {
      this.loadMap();
      loader.dismiss();
    });
  }

  loadMap() {
    let mapEle = this.mapElement.nativeElement;
    let latlon = new google.maps.LatLng(this.lat, this.lon);
    let map = new google.maps.Map(mapEle, {
      center: latlon,
      zoom: 16
    });

    let infoWindow = new google.maps.InfoWindow({
      content: `<h5>${this.loc}</h5>`
    });

    let marker = new google.maps.Marker({
      position: latlon,
      map: map,
      title: "You are here!"
    });

    marker.addListener('click', () => {
      this.deviceFeedback.acoustic();
      infoWindow.open(map, marker);
    });

    google.maps.event.addListenerOnce(map, 'idle', () => {
      mapEle.classList.add('show-map');
    });
  }
}

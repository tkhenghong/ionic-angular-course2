import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
// Referred AGM tutorial: https://dev.to/devpato/setup-google-maps-with-agm-in-angular-app-33em
@Component({
  selector: "app-map-modal",
  templateUrl: "./map-modal.component.html",
  styleUrls: ["./map-modal.component.scss"],
})
export class MapModalComponent implements OnInit, AfterViewInit {
  // Google Map stuffs. Link: https://dev.to/devpato/setup-google-map-in-angular-app-the-pro-way-3m9p
  @ViewChild("map", { static: false }) gmap: ElementRef;
  // map: google.maps.Map; // After brought in Google Map Types, you can call it here.
  lat = -34.397;
  lng = 150.644;
  zoom = 16;
  private selectedCoords: {lat: string, lng: string};

  constructor(
    private modalController: ModalController,
    private toastController: ToastController
  ) // private renderer2: Renderer2 // Angular updated way to direct manipulate DOM elements
  {}

  ngOnInit() {}

  // Load the map after entered the view, and after ngOnInit().
  ngAfterViewInit() {
    // Commented because unable to use it.
    // this.getGoogleMaps()
    //   .then((googleMaps) => {
    //     console.log('googleMaps object: ', googleMaps);
    //     const mapEl = this.gmap.nativeElement;
    //     const map = new googleMaps.Map(mapEl, {
    //       center: {
    //         lat: this.lat,
    //         lng: this.lng,
    //       },
    //       zoom: 16, // zoom means zoom how many times
    //     });
    //     // Listen until the Google Maps has loaded finished.
    //     googleMaps.event.addListenerOnce(map, "idle", () => {
    //       this.renderer2.addClass(mapEl, 'visible');
    //     });
    //   })
    //   .catch((err) => {
    //     console.error("map-modal.component.ts err: ", err);
    //     this.showGoogleMapsNotLoadedMessage(err);
    //   });
  }

  onCancel() {
    this.modalController.dismiss();
  }

  // You could also use the Angular Google Map(AGM) plugin, but he uses the old way here(script with HTML DOM method)
  // PROBLEM: This thing should be loaded, but Angular says there's a problem. So using another method.
  // private getGoogleMaps(): Promise<any> {
  //   const win = window as any; // window object exists even in JavaScript world, but it will not give any error even in TypeScript world.
  //   const googleModule = win.google;
  //   // Check Google Maps is loaded or not
  //   if (googleModule && googleModule.maps) {
  //     return Promise.resolve(googleModule.maps); // Load the Google Maps
  //   }

  //   return new Promise((resolve, reject) => {
  //     const script = document.createElement("script");
  //     script.src = `https://maps.googleapis.com/maps/api/js?key=${this.googleMapApiKey}&callback=initMap`;
  //     script.async = true;
  //     script.defer = true;
  //     document.body.appendChild(script);
  //     script.onload = () => {
  //       console.log('map loaded?');
  //       const loadedGoogleModule = win.google;
  //       if (loadedGoogleModule && loadedGoogleModule.maps) {
  //         console.log('google maps available');
  //         resolve(loadedGoogleModule.maps);
  //       } else {
  //         console.log('google maps not available')
  //         reject("Google Maps SDK not available.");
  //       }
  //     };
  //   });
  // }

  // https://stackoverflow.com/questions/44887015/angular-2-google-maps-get-coordinates-from-click-position-on-map-to-update-mark
  onMapClick(event) {
    console.log(event.coords.lat);
    console.log(event.coords.lng);
    this.selectedCoords = {lat: event.coords.lat, lng: event.coords.lng};

    this.modalController.dismiss(this.selectedCoords);
  }

  private async showGoogleMapsNotLoadedMessage(err: any) {
    const toastEl = await this.toastController.create({
      message: `Google Maps SDK has problem. error: ${err}`,
      duration: 5000,
      buttons: [
        {
          text: "Okay",
          icon: "",
          role: "cancel",
        },
      ],
    });
    await toastEl.present();
  }
}

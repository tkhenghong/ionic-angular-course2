import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import {
  ModalController,
  ActionSheetController,
  AlertController,
} from "@ionic/angular";
import { MapModalComponent } from "../../map-modal/map-modal.component";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { map, switchMap, tap } from "rxjs/operators";
import { PlaceLocation, Coordinates } from "src/app/places/location.model";
import { of } from "rxjs";

// Bring Capacitor Native API Functions
import { Plugins, Capacitor } from "@capacitor/core";

@Component({
  selector: "app-location-picker",
  templateUrl: "./location-picker.component.html",
  styleUrls: ["./location-picker.component.scss"],
})
export class LocationPickerComponent implements OnInit {
  googleMapsAPIKey: string = environment.googleMapAPIKey;
  satelliteImageWidth: number = environment.satelliteImageWidth;
  satelliteImageHeight: number = environment.satelliteImageHeight;
  satelliteImageZoom: number = environment.satelliteImageZoom;
  selectedLocationImage: string;
  isLoading: boolean;

  // Send an event out of this component
  @Output() locationPick = new EventEmitter<PlaceLocation>();

  @Input() showPreview:boolean = false;

  constructor(
    private modalController: ModalController,
    private httpClient: HttpClient,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  async onPickLocation() {
    const actionSheetEl = await this.actionSheetController.create({
      header: "Please Choose: ",
      buttons: [
        {
          text: "Auto-locate",
          handler: () => {
            this.locateUser();
          },
        },
        {
          text: "Pick on Map",
          handler: () => {
            this.openMap();
          },
        },
        {
          text: "Cancel",
          role: "cancel",
        },
      ],
    });

    await actionSheetEl.present();
  }

  private async openMap() {
    const modelEl = await this.modalController.create({
      component: MapModalComponent,
    });

    await modelEl.present();

    modelEl.onDidDismiss().then((modalData) => {
      console.log("modalData.data: ", modalData.data);
      if (!modalData || !modalData.data) {
        return;
      }
      const coordinates: Coordinates = {
        lat: modalData.data.lat,
        lng: modalData.data.lng,
      }
      this.createPlace(coordinates.lat, coordinates.lng);
    });
  }

  private createPlace(lat: number, lng: number) {
    const pickedLocation: PlaceLocation = {
      lat,
      lng,
      address: null,
      staticMapImageUrl: null,
    };
    this.isLoading = true;

      this.getAddress(lat, lng)
        .pipe(
          tap((address) => {
            console.log("location-picker.component.ts address: ", address);
          }),
          switchMap((address) => {
            pickedLocation.address = address;
            return of(
              this.getMapImage(
                pickedLocation.lat,
                pickedLocation.lng,
                this.satelliteImageZoom
              )
            );
          })
        )
        .subscribe((staticMapImageUrl) => {
          console.log(
            "location-picker.component.ts staticMapImageUrl: ",
            staticMapImageUrl
          );
          this.isLoading = false;
          pickedLocation.staticMapImageUrl = staticMapImageUrl;
          this.selectedLocationImage = staticMapImageUrl;
          // Emit the value out of this component
          this.locationPick.emit(pickedLocation);
        });
  }

  private locateUser() {
    if (!Capacitor.isPluginAvailable("Geolocation")) {
      this.showUnableToLocationUserAlert();
      return;
    } else {
      this.isLoading = true
      Plugins.Geolocation.getCurrentPosition()
        .then(geoPosition => {
          const coordinates: Coordinates = {
            lat: geoPosition.coords.latitude,
            lng: geoPosition.coords.longitude,
          };
          this.createPlace(coordinates.lat, coordinates.lng);
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.showUnableToLocationUserAlert();
        });
    }
  }

  private async showUnableToLocationUserAlert() {
    const alertEl = await this.alertController.create({
      header: "Could not fetch location",
      message: "Please use the map to pick a location!",
      buttons: [
        {
          text: 'Okay',
          role: 'cancel',
        }
      ]
    });
    await alertEl.present();
  }

  // Convert longitude and latitude to address in string (Google Geocoding API)
  // https://developers.google.com/maps/documentation/geocoding/start
  private getAddress(lat: number, lng: number) {
    return this.httpClient
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.googleMapsAPIKey}`
      )
      .pipe(
        map((geoData: any) => {
          console.log("location-picker.component.ts geoData: ", geoData);
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }

          return geoData.results[0].formatted_address;
        })
      );
  }

  // Get satellite image snapshot of the location
  // Go Google Cloud Platform enable Maps Static API
  private getMapImage(lat: number, lng: number, zoom: number) {
    // Direct send URL back and show it in ion-img
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${this.satelliteImageWidth}x${this.satelliteImageHeight}&maptype=roadmap&markers=color:red%7Clabel:Place%7C${lat},${lng}&key=${this.googleMapsAPIKey}`;
  }
}

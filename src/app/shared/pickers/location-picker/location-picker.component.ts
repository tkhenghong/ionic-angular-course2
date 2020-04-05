import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { MapModalComponent } from "../../map-modal/map-modal.component";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { map, switchMap, tap } from "rxjs/operators";
import { PlaceLocation } from "src/app/places/location.model";
import { of } from "rxjs";
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
  constructor(
    private modalController: ModalController,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {}

  async onPickLocation() {
    const modelEl = await this.modalController.create({
      component: MapModalComponent,
    });

    await modelEl.present();

    modelEl.onDidDismiss().then((modalData) => {
      console.log("modalData.data: ", modalData.data);
      if (!modalData || !modalData.data) {
        return;
      }
      const pickedLocation: PlaceLocation = {
        lat: modalData.data.lat,
        lng: modalData.data.lng,
        address: null,
        staticMapImageUrl: null,
      };
      this.isLoading = true;

      this.getAddress(modalData.data.lat, modalData.data.lng)
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
        });
    });
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

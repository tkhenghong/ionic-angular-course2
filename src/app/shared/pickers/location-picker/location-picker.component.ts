import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { MapModalComponent } from "../../map-modal/map-modal.component";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { map } from "rxjs/operators";
@Component({
  selector: "app-location-picker",
  templateUrl: "./location-picker.component.html",
  styleUrls: ["./location-picker.component.scss"],
})
export class LocationPickerComponent implements OnInit {
  googleMapsAPIKey: string = environment.googleMapAPIKey;
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
      this.getAddress(modalData.data.lat, modalData.data.lng).subscribe(
        (address) => {
          console.log("location-picker.component.ts address: ", address);
        }
      );
    });
  }

  // Convert longitude and latitude to address in string
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
}

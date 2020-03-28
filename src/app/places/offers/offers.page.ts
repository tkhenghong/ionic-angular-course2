import { Component, OnInit } from "@angular/core";
import { Place } from "src/app/place.model";
import { PlacesService } from "../places.service";
import { Router } from "@angular/router";
import { IonItemSliding } from "@ionic/angular";

@Component({
  selector: "app-offers",
  templateUrl: "./offers.page.html",
  styleUrls: ["./offers.page.scss"]
})
export class OffersPage implements OnInit {
  loadedPlaces: Place[];
  constructor(private placesService: PlacesService, private router: Router) {}

  ngOnInit() {
    this.loadedPlaces = this.placesService.places;
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close(); // Close the ion-item-sliding programmatically
    console.log("offers.page.ts offerId: ", offerId);
    this.router.navigateByUrl("/places/offers/edit-offer/" + offerId);
    // this.router.navigate(['/', 'places', 'offers', 'edit-offer', offerId]); // Use this also can. Same result.
  }
}

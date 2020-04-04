import { Component, OnInit, OnDestroy } from "@angular/core";
import { Place } from "src/app/place.model";
import { PlacesService } from "../places.service";
import { Router } from "@angular/router";
import { IonItemSliding } from "@ionic/angular";
import { Subscription } from "rxjs";

@Component({
  selector: "app-offers",
  templateUrl: "./offers.page.html",
  styleUrls: ["./offers.page.scss"]
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[];
  // Get the Subscription object emitted by the Observable
  private placesSub: Subscription;

  constructor(private placesService: PlacesService, private router: Router) {}

  ngOnInit() {
    // Commented to use RxJS
    // this.loadedPlaces = this.placesService.places;
    // Listen to the Places[] in PlacesService. If there's something changed the list, here will receive the value.
    this.placesSub = this.placesService.places.subscribe(places => {
      this.offers = places;
    });
  }

  ngOnDestroy() {
    // Remember to destroy all Subscriptions and Observables to avoid memory leaks
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close(); // Close the ion-item-sliding programmatically
    console.log("offers.page.ts offerId: ", offerId);
    this.router.navigateByUrl("/places/offers/edit-offer/" + offerId);
    // this.router.navigate(['/', 'places', 'offers', 'edit-offer', offerId]); // Use this also can. Same result.
    console.log("Editing item", offerId);
  }
}

import { Component, OnInit, OnDestroy } from "@angular/core";
import { Place } from "src/app/place.model";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { PlacesService } from "../../places.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-offer-bookings",
  templateUrl: "./offer-bookings.page.html",
  styleUrls: ["./offer-bookings.page.scss"]
})
export class OfferBookingsPage implements OnInit, OnDestroy {
  place: Place;
  private placesSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private placeService: PlacesService
  ) {}

  ngOnInit() {
    // Get URL's value using ActivatedRoute object*
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has("placeId")) {
        this.navController.navigateBack("/places/offers");
        return;
      }

      // Commented to use RxJS
      // this.place = this.placeService.getPlace(paramMap.get('placeId'));
      this.placesSub = this.placeService
        .getPlace(paramMap.get("placeId"))
        .subscribe(place => {
          this.place = place;
        });
    });
  }

  ngOnDestroy() {
    // Remember to destroy all Subscriptions and Observables to avoid memory leaks
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}

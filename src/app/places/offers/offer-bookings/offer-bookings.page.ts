import { Component, OnInit } from "@angular/core";
import { Place } from "src/app/place.model";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { PlacesService } from "../../places.service";

@Component({
  selector: "app-offer-bookings",
  templateUrl: "./offer-bookings.page.html",
  styleUrls: ["./offer-bookings.page.scss"]
})
export class OfferBookingsPage implements OnInit {
  place: Place;

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

      this.place = this.placeService.getPlace(paramMap.get('placeId'));
    });
  }
}

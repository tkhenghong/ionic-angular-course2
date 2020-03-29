import { Component, OnInit } from "@angular/core";
import { Place } from "src/app/place.model";
import { PlacesService } from "../../places.service";
import * as moment from "moment";

@Component({
  selector: "app-new-offer",
  templateUrl: "./new-offer.page.html",
  styleUrls: ["./new-offer.page.scss"]
})
export class NewOfferPage implements OnInit {
  // Self add Moment.js (Based on old Ionic doc, it's also their official way to transform Date stuffs in the web.)
  now: moment.Moment = moment();
  availableFrom: string = this.now.format("YYYY-MM-DD").toString();
  availableTo: string = this.now
    .add(1, "year")
    .format("YYYY-MM-DD")
    .toString();
  constructor() {}

  ngOnInit() {}

  onCreateOffer() {
    console.log("Creating offered place...");
  }
}

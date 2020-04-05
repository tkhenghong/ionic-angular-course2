import { Component, OnInit, Input } from "@angular/core";

import { Place } from "../../place.model";
@Component({
  selector: "app-offer-item",
  templateUrl: "./offer-item.component.html",
  styleUrls: ["./offer-item.component.scss"]
})
export class OfferItemComponent implements OnInit {
  @Input() offer: Place;

  constructor() {}

  ngOnInit() {}

  // Commented because we can get date data from our Places now
  // getDummyDate() {
  //   return new Date();
  // }
}

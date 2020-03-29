import { Component, OnInit } from "@angular/core";
import * as moment from "moment";
import { FormGroup, FormControl, Validators } from "@angular/forms";

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
  form: FormGroup;
  constructor() {}

  ngOnInit() {
    // FormGroup should be created during ngOnInit().
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: "blur", // You can determine when the form control sends valueChanged event, by using updateOn.
        validators: [
          Validators.required
        ]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onCreateOffer() {
    console.log("Creating offered place...");
  }
}

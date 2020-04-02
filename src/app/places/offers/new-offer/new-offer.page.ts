import { Component, OnInit } from "@angular/core";
import * as moment from "moment";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PlacesService } from '../../places.service';
import { Router } from '@angular/router';

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
  constructor(private placesService: PlacesService, private router: Router) {}

  ngOnInit() {
    // FormGroup should be created during ngOnInit().
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: "blur", // You can determine when the form control sends valueChanged event, by using updateOn.
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      price: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      })
    });
  }

  onCreateOffer() {
    if (!this.form.valid) {
      return;
    }
    // Get the value from the Reactive form, you normally will access valid and controls properties to check the form validity and form control values.
    console.log("Creating offered place...");
    console.log("new-offer.page.ts onCreateOffer()");
    console.log("new-offer.page.ts this.form: ", this.form);
    console.log("new-offer.page.ts this.form.valid: ", this.form.valid);
    console.log("new-offer.page.ts this.form.controls: ", this.form.controls);

    // All form values are strings by default.
    // Hint: use + sign in front of the string value to convert into number automatically.
    this.placesService.addPlace(this.form.value.title, this.form.value.description, +this.form.value.price, new Date(this.form.value.dateFrom), new Date(this.form.value.dateTo));
    this.form.reset();
    this.router.navigate(['/', 'places', 'offers']);
  }
}

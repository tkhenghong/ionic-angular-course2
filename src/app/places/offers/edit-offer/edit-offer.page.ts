import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PlacesService } from "../../places.service";
import { NavController } from "@ionic/angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Place } from "src/app/place.model";
import * as moment from "moment";

@Component({
  selector: "app-edit-offer",
  templateUrl: "./edit-offer.page.html",
  styleUrls: ["./edit-offer.page.scss"]
})
export class EditOfferPage implements OnInit {
  place: Place;
  form: FormGroup;
  now: moment.Moment = moment();
  availableFrom: string = this.now.format("YYYY-MM-DD").toString();
  availableTo: string = this.now
    .add(1, "year")
    .format("YYYY-MM-DD")
    .toString();
  constructor(
    private route: ActivatedRoute,
    private placeService: PlacesService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has("placeId")) {
        this.navController.navigateBack("/places/tabs/offers");
        return;
      }

      this.place = this.placeService.getPlace(paramMap.get("placeId"));

      this.initFormGroup();
    });
  }

  initFormGroup() {
    console.log('edit-offer.page.ts this.place.availableFrom: ', this.place.availableFrom);
    this.form = new FormGroup({
      title: new FormControl(this.place.title, {
        updateOn: "blur", // You can determine when the form control sends valueChanged event, by using updateOn.
        validators: [Validators.required]
      }),
      description: new FormControl(this.place.description, {
        updateOn: "blur",
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      price: new FormControl(this.place.price, {
        updateOn: "blur",
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl(this.place.availableFrom ? this.place.availableFrom.toISOString : undefined, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      dateTo: new FormControl(this.place.availableTo ? this.place.availableTo.toISOString: undefined, {
        updateOn: "blur",
        validators: [Validators.required]
      })
    });
  }

  onEditOffer() {
    if (!this.form.valid) {
      return;
    }
    // Get the value from the Reactive form, you normally will access valid and controls properties to check the form validity and form control values.
    console.log("Creating offered place...");
    console.log("new-offer.page.ts onEditOffer()");
    console.log("new-offer.page.ts this.form: ", this.form);
    console.log("new-offer.page.ts this.form.valid: ", this.form.valid);
    console.log("new-offer.page.ts this.form.controls: ", this.form.controls);
  }
}

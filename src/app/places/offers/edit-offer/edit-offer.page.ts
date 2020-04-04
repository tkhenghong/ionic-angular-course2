import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PlacesService } from "../../places.service";
import {
  NavController,
  LoadingController,
  ToastController,
  AlertController
} from "@ionic/angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Place } from "src/app/place.model";
import * as moment from "moment";
import { Subscription } from "rxjs";

@Component({
  selector: "app-edit-offer",
  templateUrl: "./edit-offer.page.html",
  styleUrls: ["./edit-offer.page.scss"]
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  placeId: string;
  form: FormGroup;
  now: moment.Moment = moment();
  availableFrom: string = this.now.format("YYYY-MM-DD").toString();
  availableTo: string = this.now
    .add(1, "year")
    .format("YYYY-MM-DD")
    .toString();
  private placesSub: Subscription;
  isLoading: boolean;

  constructor(
    private route: ActivatedRoute,
    private placeService: PlacesService,
    private navController: NavController,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has("placeId")) {
        this.navController.navigateBack("/places/tabs/offers");
        return;
      }
      this.placeId = paramMap.get("placeId");
      this.isLoading = true;
      // Commented to use RxJS
      // this.place = this.placeService.getPlace(paramMap.get("placeId"));
      this.placesSub = this.placeService
        .getPlace(this.placeId)
        .subscribe(place => {
          this.place = place;
          this.initFormGroup();
        }, async error => {
          // Handle the error if an error occurred to HTTP request(For example, network down, invalid data etc.)
          const alertEl = await this.alertController.create({
            header: 'An error occurred.',
            message: `Place could not be fetched. Please try again later. Error: ${error}`,
            buttons: [
              {
                text: 'Okay',
                handler: () => {
                  this.router.navigate(['/places/offers'])
                }
              }
            ]
          });
          await alertEl.present();
        });
    });
  }

  ngOnDestroy() {
    // Remember to destroy all Subscriptions and Observables to avoid memory leaks
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  initFormGroup() {
    console.log(
      "edit-offer.page.ts this.place.availableFrom: ",
      this.place.availableFrom
    );
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
      dateFrom: new FormControl(
        this.place.availableFrom
          ? this.place.availableFrom.toISOString()
          : undefined,
        {
          updateOn: "blur",
          validators: [Validators.required]
        }
      ),
      dateTo: new FormControl(
        this.place.availableTo
          ? this.place.availableTo.toISOString()
          : undefined,
        {
          updateOn: "blur",
          validators: [Validators.required]
        }
      )
    });
    this.isLoading = false;
  }

  async onEditOffer() {
    if (!this.form.valid) {
      return;
    }
    // Get the value from the Reactive form, you normally will access valid and controls properties to check the form validity and form control values.
    console.log("Creating offered place...");
    console.log("new-offer.page.ts onEditOffer()");
    console.log("new-offer.page.ts this.form: ", this.form);
    console.log("new-offer.page.ts this.form.valid: ", this.form.valid);
    console.log("new-offer.page.ts this.form.controls: ", this.form.controls);

    // Show Loading
    const loadingElement = await this.loadingController.create({
      message: "Editing place...."
    });
    await loadingElement.present();
    this.placeService
      .editPlace(
        this.place.id,
        this.form.value.title,
        this.form.value.description,
        +this.form.value.price,
        new Date(this.form.value.dateFrom),
        new Date(this.form.value.dateTo)
      )
      .subscribe(() => {
        loadingElement.dismiss();
        this.form.reset();
        this.router.navigate(["/", "places", "offers"]);
        this.showOfferCreatedMessage();
      });
  }
  async showOfferCreatedMessage() {
    const toast = await this.toastController.create({
      header: "Offer edited.",
      duration: 1000,
      buttons: [
        {
          side: "end",
          text: "Close",
          icon: "close-outline",
          role: "cancel"
        }
      ]
    });
    await toast.present();
  }
}

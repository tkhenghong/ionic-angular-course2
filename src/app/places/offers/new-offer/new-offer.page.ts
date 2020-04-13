import { Component, OnInit } from "@angular/core";
import * as moment from "moment";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PlacesService } from "../../places.service";
import { Router } from "@angular/router";
import { LoadingController, ToastController } from "@ionic/angular";
import { PlaceLocation } from "../../location.model";

@Component({
  selector: "app-new-offer",
  templateUrl: "./new-offer.page.html",
  styleUrls: ["./new-offer.page.scss"],
})
export class NewOfferPage implements OnInit {
  // Self add Moment.js (Based on old Ionic doc, it's also their official way to transform Date stuffs in the web.)
  now: moment.Moment = moment();
  availableFrom: string = this.now.format("YYYY-MM-DD").toString();
  availableTo: string = this.now.add(1, "year").format("YYYY-MM-DD").toString();
  form: FormGroup;
  constructor(
    private placesService: PlacesService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    // FormGroup should be created during ngOnInit().
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: "blur", // You can determine when the form control sends valueChanged event, by using updateOn.
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      price: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required, Validators.min(1)],
      }),
      dateFrom: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      location: new FormControl(null, {
        updateOn: "blur",
        validators: Validators.required,
      }),
      image: new FormControl(null),
    });
  }

  onLocationPicked(placeLocation: PlaceLocation) {
    // Pass the location value emitted from LocationPickerComponent to the FormControl
    this.form.patchValue({ location: placeLocation });
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    console.log("imageData: ", imageData);
    if (typeof imageData === "string") {
      console.log('if (typeof imageData === "string")');
      // It's a string
      try {
        // Before pass the base64 string, we need to remove the header first.
        // Content type is always JPEG, because Capacitor Image/Camera plugin always give you JPEGs format photo.
        imageFile = this.base64ToBlob(
          imageData.replace("data:image/jpeg;base64,", ""),
          "image/jpeg"
        );
      } catch (err) {
        console.log("error: ", err);
      }
    } else {
      console.log('if (typeof imageData === "File")');
      // It's a File
      imageFile = imageData;
    }

    console.log("End result imageFile: ", imageFile);

    this.form.patchValue({ image: imageFile });
  }

  async onCreateOffer() {
    if (!this.form.valid || !this.form.get("image").value) {
      return;
    }
    console.log("this.form.value: ", this.form.value);
    // Get the value from the Reactive form, you normally will access valid and controls properties to check the form validity and form control values.
    console.log("Creating offered place...");
    console.log("new-offer.page.ts onCreateOffer()");
    console.log("new-offer.page.ts this.form: ", this.form);
    console.log("new-offer.page.ts this.form.valid: ", this.form.valid);
    console.log("new-offer.page.ts this.form.controls: ", this.form.controls);
    // Show Loading
    const loadingElement = await this.loadingController.create({
      message: "Creating place....",
    });
    await loadingElement.present();
    // All form values are strings by default.
    // Hint: use + sign in front of the string value to convert into number automatically.
    // Now, because we only used tap() RxJS operator in PlacesService, now here we can get shared by it's Observable object.
    this.placesService
      .addPlace(
        this.form.value.title,
        this.form.value.description,
        +this.form.value.price,
        new Date(this.form.value.dateFrom),
        new Date(this.form.value.dateTo),
        this.form.value.location
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
      header: "Offer created.",
      duration: 1000,
      buttons: [
        {
          side: "end",
          text: "Close",
          icon: "close-outline",
          role: "cancel",
        },
      ],
    });
    await toast.present();
  }

  // Base64 string to Blob
  // https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  private base64ToBlob(
    base64: string,
    contentType: string,
    sliceSize: number = 512
  ) {
    contentType = contentType || "";

    // const byteCharacters = window.atob(base64); // Commented because the window object is obsolete latest Ionic 5/Angular 9 project
    const byteCharacters = atob(base64);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }

      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }
}

import { Component, OnInit, Input } from "@angular/core";
import { Place } from "src/app/place.model";
import { ModalController } from "@ionic/angular";
import * as moment from "moment";
import { NgForm } from '@angular/forms';

@Component({
  selector: "app-create-booking",
  templateUrl: "./create-booking.component.html",
  styleUrls: ["./create-booking.component.scss"]
})
export class CreateBookingComponent implements OnInit {
  // Get the data from the place where you called this modal.
  @Input() selectedPlace: Place;
  @Input() selectedMode: "select" | "random";

  // now: moment.Moment = moment();
  // availableFrom: string = this.now.format("YYYY-MM-DD").toString();
  // availableTo: string = this.now
  // .add(1, "year")
  // .format("YYYY-MM-DD")
  // .toString();
  startDate: string;
  endDate: string;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);

    if (this.selectedMode === "random") {
      // Generate random starting and ending dates, but both of them must have at least have a few days gap duration
      this.startDate = new Date(
        availableFrom.getTime() +
          Math.random() *
            (availableTo.getTime() -
              7 * 24 * 60 * 60 * 1000 -
              availableFrom.getTime())
      ).toISOString();
      this.endDate = new Date(
        new Date(this.startDate).getTime() +
          Math.random() *
            (new Date(this.startDate).getTime() +
              6 * 24 * 60 * 60 * 1000 -
              new Date(this.startDate).getTime())
      ).toISOString();

      console.log(
        "create-booking.component.ts this.startDate: ",
        this.startDate
      );
      console.log("create-booking.component.ts this.endDate: ", this.endDate);
    }
  }

  onBookPlace(f: NgForm) {
    if(!f.valid) {
      return;
    }
    // Send the result data back to where this modal is called.
    // This dismissal is assigned as confirm role****
    this.modalController.dismiss(
      { message: "This is a dummy message!" },
      "confirm"
    );
  }

  // Different from other Ionic pages, the modal component needs to be close by using ModalController
  onCancel() {
    // You may define or no need to define your modal ID as the argument to specifically close the correct modal.
    // You also can set a role for the dismiss function. The modalController will give a function based on the role for the dismissal.
    // For example, cancel means close the modal.****
    this.modalController.dismiss("testID", "cancel");
  }
}

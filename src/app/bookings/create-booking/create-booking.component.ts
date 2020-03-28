import { Component, OnInit, Input } from "@angular/core";
import { Place } from "src/app/place.model";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-create-booking",
  templateUrl: "./create-booking.component.html",
  styleUrls: ["./create-booking.component.scss"]
})
export class CreateBookingComponent implements OnInit {
  // Get the data from the place where you called this modal.
  @Input() selectedPlace: Place;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  onBookPlace() {
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

import { Component, OnInit, OnDestroy } from "@angular/core";
import { BookingsService } from "./bookings.service";
import { Booking } from "./booking.model";
import {
  IonItemSliding,
  LoadingController,
  ToastController
} from "@ionic/angular";
import { Subscription } from "rxjs";

@Component({
  selector: "app-bookings",
  templateUrl: "./bookings.page.html",
  styleUrls: ["./bookings.page.scss"]
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  private bookingSub: Subscription;

  constructor(
    private bookingsService: BookingsService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.bookingSub = this.bookingsService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });
  }

  ngOnDestroy() {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }

  async onCancelBooking(bookingId: string, slidingElement: IonItemSliding) {
    slidingElement.close();
    const loadingEl = await this.loadingController.create({
      message: "Cancel booking..."
    });
    await loadingEl.present();
    // cancel booking with id offerId
    this.bookingsService.cancelBooking(bookingId).subscribe(() => {
      loadingEl.dismiss();
      this.showBookingCancelledMessage();
    });
  }

  async showBookingCancelledMessage() {
    const toastEl = await this.toastController.create({
      message: "Booking cancelled.",
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
    await toastEl.present();
  }
}

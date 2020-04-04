import { Injectable } from "@angular/core";
import { Booking } from "./booking.model";
import { BehaviorSubject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { take, tap, delay } from "rxjs/operators";

// Every service that you created, you will see this providedIn: root thing.
// This actually means it will be loaded and can be accessed by whole app scope.
// The modules don't have to import this service in their module.ts files.
@Injectable({
  providedIn: "root"
})
export class BookingsService {
  private _bookings: BehaviorSubject<Booking[]> = new BehaviorSubject<
    Booking[]
  >([]);

  get bookings() {
    return this._bookings.asObservable();
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap(bookings => {
        this._bookings.next(bookings.concat(newBooking));
      })
    );
  }

  cancelBooking(bookingId: string) {
    // Use same RxJS operators to get one, fake loading, get the bookings and filter out the unwanted booking.
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap(bookings => {
        this._bookings.next(bookings.filter(b => b.id !== bookingId));
      })
    );
  }

  constructor(private authService: AuthService) {}
}

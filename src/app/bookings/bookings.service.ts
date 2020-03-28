import { Injectable } from "@angular/core";
import { Booking } from "./booking.model";

// Every service that you created, you will see this providedIn: root thing.
// This actually means it will be loaded and can be accessed by whole app scope.
// The modules don't have to import this service in their module.ts files.
@Injectable({
  providedIn: "root"
})
export class BookingsService {
  private _bookings: Booking[] = [
    {
      id: "xyz",
      placeId: "p1",
      placeTitle: "Manhattan Mansion",
      guestNumber: 2,
      userId: "abc"
    }
  ];

  get bookings() {
    return [...this._bookings];
  }
  constructor() {}
}

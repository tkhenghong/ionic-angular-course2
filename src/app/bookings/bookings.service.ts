import { Injectable } from "@angular/core";
import { Booking } from "./booking.model";
import { BehaviorSubject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { take, tap, delay, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

// Bring over environment variables
import { environment } from "../../environments/environment";

// Every service that you created, you will see this providedIn: root thing.
// This actually means it will be loaded and can be accessed by whole app scope.
// The modules don't have to import this service in their module.ts files.
@Injectable({
  providedIn: "root",
})
export class BookingsService {
  private _bookings: BehaviorSubject<Booking[]> = new BehaviorSubject<
    Booking[]
  >([]);
  private databaseURL: string = environment.databaseURL;
  private databaseName: string = "bookings";
  private endURL: string = ".json";

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
    let generatedId: string;

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

    return this.httpClient
      .post<{ name: string }>(
        `${this.databaseURL}/${this.databaseName}${this.endURL}`,
        { ...newBooking, id: null }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.bookings;
        }),
        take(1), // take(1) is very important, because if we don't take 1, this subscription never ends and we'll loading forever.
        tap((bookings) => {
          newBooking.id = generatedId;
          this._bookings.next(bookings.concat(newBooking));
        })
      );
  }

  cancelBooking(bookingId: string) {
    // Use same RxJS operators to get one, fake loading, get the bookings and filter out the unwanted booking.
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap((bookings) => {
        this._bookings.next(bookings.filter((b) => b.id !== bookingId));
      })
    );
  }

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}
}

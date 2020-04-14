import { Injectable } from "@angular/core";
import { Booking } from "./booking.model";
import { BehaviorSubject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { take, tap, delay, switchMap, map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

// Bring over environment variables
import { environment } from "../../environments/environment";

interface BookingData {
  id: string;
  placeId: string;
  userId: string;
  placeTitle: string;
  placeImage: string;
  firstName: string;
  lastName: string;
  guestNumber: number;
  bookedFrom: string;
  bookedTo: string;
}

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

  fetchBookings() {
    return this.authService.userId.pipe(
      switchMap((userId) => {
        console.log("bookings.service.ts userId: ", userId);
        if (!userId) {
          throw new Error("User not found!");
        }
        return this.httpClient.get<{ [key: string]: BookingData }>(
          `${this.databaseURL}/${this.databaseName}${this.endURL}?orderBy="userId"&equalTo="${userId}"`
        );
      }),
      map((bookingData) => {
        const bookings = [];
        for (const key in bookingData) {
          if (bookingData.hasOwnProperty(key)) {
            bookings.push(
              new Booking(
                key,
                bookingData[key].placeId,
                bookingData[key].userId,
                bookingData[key].placeTitle,
                bookingData[key].placeImage,
                bookingData[key].firstName,
                bookingData[key].lastName,
                bookingData[key].guestNumber,
                new Date(bookingData[key].bookedFrom),
                new Date(bookingData[key].bookedTo)
              )
            );
          }
        }

        return bookings;
      }),
      tap((bookings) => {
        this._bookings.next(bookings);
      })
    );
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
    // Multiple observable chain with switchMaps in pipe()
    let generatedId: string;
    let newBooking: Booking;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error("No user ID found!");
        }

        newBooking = new Booking(
          Math.random().toString(),
          placeId,
          userId,
          placeTitle,
          placeImage,
          firstName,
          lastName,
          guestNumber,
          dateFrom,
          dateTo
        );

        return this.httpClient.post<{ name: string }>(
          `${this.databaseURL}/${this.databaseName}${this.endURL}`,
          { ...newBooking, id: null }
        );
      }),
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
    return this.httpClient
      .delete(
        `${this.databaseURL}/${this.databaseName}/${bookingId}${this.endURL}`
      )
      .pipe(
        switchMap(() => {
          return this.bookings;
        }),
        take(1),
        tap((bookings) => {
          this._bookings.next(bookings.filter((b) => b.id !== bookingId));
        })
      );
    // Use same RxJS operators to get one, fake loading, get the bookings and filter out the unwanted booking.
    // return this.bookings.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((bookings) => {
    //     this._bookings.next(bookings.filter((b) => b.id !== bookingId));
    //   })
    // );
  }

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}
}

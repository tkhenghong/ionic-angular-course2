import { Injectable } from "@angular/core";
import { Place } from "../place.model";
import { AuthService } from "../auth/auth.service";
import { BehaviorSubject } from "rxjs";
import { take, map, tap, delay, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class PlacesService {
  // RxJS full playlist: https://www.youtube.com/watch?v=T9wOu11uU6U&list=PL55RiY5tL51pHpagYcrN9ubNLVXF8rGVi
  private _places: BehaviorSubject<Place[]> = new BehaviorSubject<Place[]>([
    new Place(
      "p1",
      "Manhattan Mansion",
      "In the heart of New York City.",
      "https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200",
      149.99,
      new Date("2020-01-01"),
      new Date("2020-12-31"),
      "abc"
    ),
    new Place(
      "p2",
      "L' Amour Toujours",
      "A romantic place in Paris!",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg",
      189.99,
      new Date("2020-01-01"),
      new Date("2020-12-31"),
      "abc"
    ),
    new Place(
      "p3",
      "The Foggy Palace",
      "Not your average city trip!",
      "https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg",
      99.99,
      new Date("2020-01-01"),
      new Date("2020-12-31"),
      "abc"
    ),
  ]);

  // Inject AuthService to this service to bring the current logged in userId into object creation. Brilliant!
  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  get places() {
    // return a copy of this array
    // return [...this._places];
    return this._places.asObservable();
  }

  // Return the one place but still an Observable
  getPlace(id: string) {
    // return { ...this._places.find(p => p.id === id) };
    return this._places.pipe(
      take(1),
      map((places) => {
        return { ...places.find((p) => p.id === id) };
      })
    );
  }

  // When you save new places and add it into your array or any variables, but the other pages are not rendered again or auto reflect the changes of the current list.
  // Although you can use ngAfterViewInit Life cycle, but it is not a good solution as it renders the whole page every time the value is changed. More performance issues.
  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string

    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      "https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg",
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    // Save to the database.
    return this.httpClient
      .post<{name: string}>(
        "https://ionic-angular-course-e937d.firebaseio.com/offered-places.json",
        { ...newPlace, id: null }
      )
      .pipe(
        switchMap(resData => {
          // Firebase have auto generated ID back to you
          generatedId = resData.name;
          return this.places; // Not yet go back to the caller.
        }),
        take(1),
          tap((places) => {
        // Add the newPlace into the current list of Places
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
      );

    // Add something into BehaviourSubject object
    // Changed from subscribe() to get the data to use tap.
    // The difference between tap and subscribe is subscribe will complete(stop) the observable but tap won't complete(stop) the observable.
    // Also, if you use subscribe here, only here can keep seeing the value, but other places will not able to see the value.
    // But tap it will not cause any complete(stop) of observable in any situation, but also allows more places to share the same Observable variable.
    // Commented below because we will use HTTP to send data to DB and use it's Observable object.
    // return this._places.pipe(
    //   take(1), // Go look at the current places list, but only take 1 once and unsubscribed
    //   delay(1000), // Instead of using setTimeout(), in RxJS better to use delay to do the same thing, because even you can delay something is the function of the setTimeout(), but you can't delay the whole Observable for example 1 second.
    //   tap((places) => {
    //     // Add the newPlace into the current list of Places
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  // or editOffer() {}
  editPlace(
    id: string,
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    return this._places.pipe(
      take(1),
      delay(1000), // Fake delay to show spinner
      tap((places) => {
        const updatedPlaceIndex = places.findIndex((pl) => pl.id === id); // Find the array's index
        const updatedPlaces = [...places]; // Don't want to mutate the old state
        const old = updatedPlaces[updatedPlaceIndex]; // Keep the old one temporarily
        updatedPlaces[updatedPlaceIndex] = new Place(
          old.id,
          title,
          description,
          old.imageUrl,
          price,
          dateFrom,
          dateTo,
          old.userId // Some properties can be retained from old object
        );

        this._places.next(updatedPlaces);
      })
    );
  }
}

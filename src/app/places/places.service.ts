import { Injectable } from "@angular/core";
import { Place } from "../place.model";
import { AuthService } from "../auth/auth.service";
import { BehaviorSubject } from "rxjs";
import { take, map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
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
    )
  ]);

  // Inject AuthService to this service to bring the current logged in userId into object creation. Brilliant!
  constructor(private authService: AuthService) {}

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
      map(places => {
        return { ...places.find(p => p.id === id) };
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

    // Add something into BehaviourSubject object
    this._places
      .pipe(
        take(1) // Go look at the current places list, but only take 1 once and unsubscribed
      )
      .subscribe(places => {
        // Add the newPlace into the current list of Places
        this._places.next(places.concat(newPlace));
      }); // this.places.pipe().subscribe(...) also can

    console.log("places.service.ts this._places: ", this._places);
  }
}

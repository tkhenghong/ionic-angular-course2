import { Injectable } from "@angular/core";
import { Place } from "./place.model";
import { AuthService } from "../auth/auth.service";
import { BehaviorSubject, of } from "rxjs";
import { take, map, tap, delay, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

// Bring over environment variables
import { environment } from "../../environments/environment";
import { PlaceLocation } from "./location.model";

interface PlaceData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  availableFrom: Date;
  availableTo: Date;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: "root",
})
export class PlacesService {
  // RxJS full playlist: https://www.youtube.com/watch?v=T9wOu11uU6U&list=PL55RiY5tL51pHpagYcrN9ubNLVXF8rGVi
  private _places: BehaviorSubject<Place[]> = new BehaviorSubject<Place[]>([]);
  private databaseURL: string = environment.databaseURL;
  private databaseName: string = "offered-places";
  private endURL: string = ".json";

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

  // Have an HTTP API to get Places data from Firebase
  fetchPlaces() {
    // https://ionic-angular-course-e937d.firebaseio.com -- Original URL of the Database
    // https://ionic-angular-course-e937d.firebaseio.com/NAMEOFTHEDATABASE.json -- Original URL + the name of the database. (It will auto create the database if it's not created yet.)
    // If you got any object properties that you not sure or don't know it will return, you can put
    return this.httpClient
      .get<{ [key: string]: PlaceData }>(
        `${this.databaseURL}/${this.databaseName}${this.endURL}`
      )
      .pipe(
        tap((resData) => {
          console.log("places.service.ts resData: ", resData);
        }),
        map((resData) => {
          const places = [];
          for (const key in resData) {
            // Check the key value from the list of response data objects return from Firebase is exist or not
            // if (resData.hasOwnProperty(key)) is a recommended practice
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId,
                  resData[key].location
                )
              );
            }
          }

          return places;
        }),
        tap((places) => {
          this._places.next(places);
        })
      );
  }

  // Return the one place but still an Observable
  getPlace(id: string) {
    return this.httpClient
      .get<Place>(
        `${this.databaseURL}/${this.databaseName}/${id}${this.endURL}`
      )
      .pipe(
        tap((resData) => {
          console.log("places.service.ts This one? resData: ", resData);
        }),
        map((placeData) => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId,
            placeData.location
          );
        })
      );
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
    dateTo: Date,
    placeLocation: PlaceLocation,
    imageUrl: string
  ) {
    let generatedId: string;

    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      imageUrl,
      price,
      dateFrom,
      dateTo,
      this.authService.userId,
      placeLocation,
    );
    // Save to the database.
    return this.httpClient
      .post<{ name: string }>(
        `${this.databaseURL}/${this.databaseName}${this.endURL}`,
        { ...newPlace, id: null }
      )
      .pipe(
        switchMap((resData) => {
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
    let updatedPlaces: Place[];
    return this._places.pipe(
      take(1),
      switchMap((places) => {
        // If we are trying to edit the place but the Place[] are not initialized yet
        if (!places || places.length <= 0) {
          return this.fetchPlaces(); // Fetch the places now
        } else {
          return of(places);
        }
      }),
      switchMap((places) => {
        const updatedPlaceIndex = places.findIndex((pl) => pl.id === id); // Find the array's index
        updatedPlaces = [...places]; // Don't want to mutate the old state
        const old = updatedPlaces[updatedPlaceIndex]; // Keep the old one temporarily
        updatedPlaces[updatedPlaceIndex] = new Place(
          old.id,
          title,
          description,
          old.imageUrl,
          price,
          dateFrom,
          dateTo,
          old.userId, // Some properties can be retained from old object
          old.location
        );
        // Edit place using HTTP request
        return this.httpClient.put(
          `${this.databaseURL}/${this.databaseName}/${id}${this.endURL}`,
          {
            ...updatedPlaces[updatedPlaceIndex],
            id: null,
          }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }

  uploadImage(image: File) {
    const uploadData = new FormData(); // JavaScript stuffs
    uploadData.append("image", image);
    // AFTER setup Firebase Storage,
    // installed Firebase Tools CLI into your computer,
    // init and install Firebase Functions into your project,
    // edit the index.js file and
    // deploy the code to Cloud,
    // you need to go Firebase Console > Functions.
    // There you'll see a uploaded function there and an URL is generated for you.
    // Get that function and paste it here.
    return this.httpClient.post<{imageUrl: string, imagePath: string}>(
      "https://us-central1-ionic-angular-course-e937d.cloudfunctions.net/storeImage",
      uploadData
    );
  }
}

// Old sample data, Places[]:
// new Place(
//   "p1",
//   "Manhattan Mansion",
//   "In the heart of New York City.",
//   "https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200",
//   149.99,
//   new Date("2020-01-01"),
//   new Date("2020-12-31"),
//   "abc"
// ),
// new Place(
//   "p2",
//   "L' Amour Toujours",
//   "A romantic place in Paris!",
//   "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg",
//   189.99,
//   new Date("2020-01-01"),
//   new Date("2020-12-31"),
//   "abc"
// ),
// new Place(
//   "p3",
//   "The Foggy Palace",
//   "Not your average city trip!",
//   "https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg",
//   99.99,
//   new Date("2020-01-01"),
//   new Date("2020-12-31"),
//   "abc"
// ),

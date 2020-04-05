import { Component, OnInit, OnDestroy } from "@angular/core";
import { PlacesService } from "../places.service";
import { Place } from "../place.model";
import { MenuController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-discover",
  templateUrl: "./discover.page.html",
  styleUrls: ["./discover.page.scss"],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  relevantPlaces: Place[];
  private placesSub: Subscription;
  isLoading: boolean;
  constructor(
    private placesService: PlacesService,
    private menuController: MenuController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Commented to use RxJS
    // this.loadedPlaces = this.placesService.places;
    // this.listedLoadedPlaces = this.loadedPlaces.slice(1);
    this.placesSub = this.placesService.places.subscribe((places) => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    // Remember to destroy all Subscriptions and Observables to avoid memory leaks
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  // Open, close or toggle the side menu programmatically using MenuController.
  // onOpenMenu() {
  // this.menuController.open('first');
  // this.menuController.close('first');
  // this.menuController.toggle('first');
  // }

  // CustomEvent is not in Ionic 5. (Not in Official documentation)
  onFilterUpdate(event: any) {
    console.log("discover.page.ts event.detail: ", event.detail);
    if (event.detail.value === "all") {
      // All places
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    } else {
      // Bookable places
      // Filter out the Places that is not created by you
      this.relevantPlaces = this.loadedPlaces.filter(
        (place) => place.userId !== this.authService.userId
      );
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    }
  }
}

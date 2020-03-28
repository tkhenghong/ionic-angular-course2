import { Component, OnInit } from "@angular/core";
import { PlacesService } from "../places.service";
import { Place } from "../../place.model";
import { MenuController } from "@ionic/angular";

@Component({
  selector: "app-discover",
  templateUrl: "./discover.page.html",
  styleUrls: ["./discover.page.scss"]
})
export class DiscoverPage implements OnInit {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  constructor(
    private placesService: PlacesService,
    private menuController: MenuController
  ) {}

  ngOnInit() {
    this.loadedPlaces = this.placesService.places;
    this.listedLoadedPlaces = this.loadedPlaces.slice(1);
  }

  // Open, close or toggle the side menu programmatically using MenuController.
  // onOpenMenu() {
  // this.menuController.open('first');
  // this.menuController.close('first');
  // this.menuController.toggle('first');
  // }

  // CustomEvent is not in Ionic 5. (Not in Official documentation)
  onFilterUpdate(event: any) {
    console.log('discover.page.ts event.detail: ', event.detail);
  }
}

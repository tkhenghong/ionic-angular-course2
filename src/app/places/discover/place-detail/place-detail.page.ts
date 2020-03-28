import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavController, ModalController } from "@ionic/angular";
import { CreateBookingComponent } from "src/app/bookings/create-booking/create-booking.component";

@Component({
  selector: "app-place-detail",
  templateUrl: "./place-detail.page.html",
  styleUrls: ["./place-detail.page.scss"]
})
export class PlaceDetailPage implements OnInit {
  constructor(
    // Ways to navigate in Ionic application
    // 1st method: Router method (By Angular)
    private router: Router,
    // 2nd method: NavController (By Ionic)
    private navCtrl: NavController,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  onBookPlace() {
    // 1st method: Router method
    // But it plays wrong animation (plays forward)
    // this.router.navigateByUrl('/places/discover');

    // 2nd method: NavController (url in array form also can) (main) (Commented to open a model instead going back)
    // this.navCtrl.navigateBack("/places/discover");

    // If you can guarantee there's always a page that you can go back, then use it. Otherwise, better use navigateBack() method
    // this.navCtrl.pop();

    // You need to create a modal with Putting a Component class in it.
    this.modalController
      .create({ component: CreateBookingComponent })
      .then(modal => {
        modal.present();
      });
  }
}

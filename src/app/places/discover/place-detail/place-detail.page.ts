import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  NavController,
  ModalController,
  AlertController,
  ActionSheetController,
  ToastController
} from "@ionic/angular";
import { CreateBookingComponent } from "src/app/bookings/create-booking/create-booking.component";
import { Place } from "src/app/place.model";
import { PlacesService } from "../../places.service";

@Component({
  selector: "app-place-detail",
  templateUrl: "./place-detail.page.html",
  styleUrls: ["./place-detail.page.scss"]
})
export class PlaceDetailPage implements OnInit {
  public place: Place;

  constructor(
    // Ways to navigate in Ionic application
    // 1st method: Router method (By Angular)
    private router: Router,
    // 2nd method: NavController (By Ionic)
    private navController: NavController,
    private modalController: ModalController,
    private placeService: PlacesService,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has("placeId")) {
        this.navController.navigateBack("/places/offers");
        return;
      }

      this.place = this.placeService.getPlace(paramMap.get("placeId"));
    });
  }

  async onBookPlace() {
    // 1st method: Router method
    // But it plays wrong animation (plays forward)
    // this.router.navigateByUrl('/places/discover');

    // 2nd method: NavController (url in array form also can) (main) (Commented to open a model instead going back)
    // this.navCtrl.navigateBack("/places/discover");

    // If you can guarantee there's always a page that you can go back, then use it. Otherwise, better use navigateBack() method
    // this.navCtrl.pop();

    // ActionSheetController
    // https://ionicframework.com/docs/api/action-sheet
    const actionSheetElement = await this.actionSheetController.create({
      header: "Choose an action: ",
      buttons: [
        {
          text: "Select Date",
          handler: () => {
            this.openBookingModal("select");
          }
        },
        {
          text: "Random Date",
          handler: () => {
            this.openBookingModal("random");
          }
        },
        {
          text: "Cancel",
          role: "cancel"
          // role: 'destructive' // This is used when the user wants to delete something, and you show this button as red.
        }
      ]
    });

    actionSheetElement.present();
  }

  // This type of argument got validation check that the argument must be either 'select' value or 'random' value only.
  openBookingModal(mode: "select" | "random") {
    console.log("place-detail.page.ts mode: ", mode);
    // You need to create a modal with Putting a Component class in it.
    this.modalController
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place, selectedMode: mode }, // Passing data into this modal
        id: "testID"
      })
      .then(modal => {
        modal.present();

        // Set a listener to listen for returned data of the modal
        return modal.onDidDismiss();
      })
      .then(resultData => {
        console.log("place-detail.page.ts resultData: ", resultData);
        if (resultData.role === "confirm") {
          console.log("place-detail.page.ts BOOKED!");
          this.showBookedMessage();
        }
      });
  }

  async showBookedMessage() {
    // const alert = await this.alertController.create({
    //   header: "Booked!",
    //   buttons: [
    //     {
    //       text: "OK",
    //       role: "cancel"
    //     }
    //   ]
    // });

    // await alert.present();

    // ToastController
    // https://ionicframework.com/docs/api/toast
    const toast = await this.toastController.create({
      header: 'Booked!',
      // message: 'Click to Close',
      // position: 'top', // Problem: It's looking horrible in iOS.
      buttons: [
        {
          side: 'end',
          text: "Undo",
          icon: 'arrow-undo-outline',
          handler: () => {
            this.showUndoMessage();
          }
        },
        {
          side: 'end',
          text: "Close",
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  async showUndoMessage() {
    const alert = await this.alertController.create({
      header: 'Undo successful.',
      buttons: [{
        text: 'OK',
        role: 'cancel'
      }]
    });
    await alert.present();
  }
}

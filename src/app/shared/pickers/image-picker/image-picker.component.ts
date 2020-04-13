import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import {
  Capacitor,
  Plugins,
  CameraSource,
  CameraResultType,
} from "@capacitor/core";
import { AlertController } from "@ionic/angular";

import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-image-picker",
  templateUrl: "./image-picker.component.html",
  styleUrls: ["./image-picker.component.scss"],
})
export class ImagePickerComponent implements OnInit {
  selectedImage: string;

  @Output() imagePick = new EventEmitter<string>();

  constructor(private alertController: AlertController) {}

  ngOnInit() {}

  onPickImage() {
    if (!Capacitor.isPluginAvailable("Camera")) {
      this.showUnableGetPhotoAlert();
      // If the device doesn't have Camera
      return;
    } else {
      Plugins.Camera.getPhoto({
        quality: 50,
        source: CameraSource.Prompt, // Ask the user either pick photo from Gallery or create new photo using Camera
        correctOrientation: true, // Make sure orientation of the camera is automatically fixed
        height: environment.photoHeight, // The larger the resolution, the harder it is to be uploaded to the web DB
        width: environment.photoWidth,
        resultType: CameraResultType.Base64, // return as a string which can be encoded into a file or whatever
      })
        .then((image) => {
          // Problem: the camera plugin does take the base64 string out,
          // but you need to add a header to make ion-img or any other image reader to recognize it as base64 string first.
          let base64Image = "data:image/jpeg;base64," + image.base64String;
          this.selectedImage = base64Image;
          this.imagePick.emit(base64Image);
        })
        .catch((err) => {
          console.log(err);
          this.showUnableGetPhotoAlert();
          return false;
        });
    }
  }

  private async showUnableGetPhotoAlert() {
    const alertEl = await this.alertController.create({
      header: "Could not use Photo/Gallery functions",
      message:
        "Please ensure Camera permission/Gallery app is working properly.",
      buttons: [
        {
          text: "Okay",
          role: "cancel",
        },
      ],
    });
    await alertEl.present();
  }
}

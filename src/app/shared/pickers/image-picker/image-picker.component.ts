import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  Capacitor,
  Plugins,
  CameraSource,
  CameraResultType,
} from "@capacitor/core";
import { AlertController, Platform } from "@ionic/angular";

import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-image-picker",
  templateUrl: "./image-picker.component.html",
  styleUrls: ["./image-picker.component.scss"],
})
export class ImagePickerComponent implements OnInit {
  selectedImage: string;
  usePicker: boolean = false;

  @ViewChild("filePicker", { static: false }) filePickerRef: ElementRef<
    HTMLInputElement
  >;

  @Output() imagePick = new EventEmitter<string>();

  constructor(
    private alertController: AlertController,
    private platform: Platform
  ) {}

  ngOnInit() {
    console.log("this.platform.is('mobile'): ", this.platform.is("mobile")); // True when desktop Chrome inspection mode shrinks the window and makes it think it is in the mobile's browser. Any window that is small enough will make it true.
    console.log("this.platform.is('hybrid'): ", this.platform.is("hybrid")); // Only true when running on Android/iOS simulator/device.
    console.log("this.platform.is('ios'): ", this.platform.is("ios")); // Only true when choose iOS device in desktop Chrome inspect mode with iPhone X, or in true iOS simulator/device.
    console.log("this.platform.is('android'): ", this.platform.is("android")); // This is false. Only true when choosing Pixel XL device in desktop Chrome inspect mode, or in true Android simulator/device.
    console.log("this.platform.is('desktop'): ", this.platform.is("desktop")); // This is false. Only true when you are not choosing any mobile device's resolution to view in inspect mode of desktop Chrome browser.

    if (
      (this.platform.is("mobile") && !this.platform.is("hybrid")) ||
      this.platform.is("desktop")
    ) {
      this.usePicker = true;
    }
  }

  onFileChosen(event: Event) {
    console.log("image-picker.component.ts onFileChosen()");
    console.log("image-picker.component.ts event: ", event);
    // Extract the file from the event
    const pickedFile = (event.target as HTMLInputElement).files[0];
    // Convert it to base64 string
    if (!pickedFile) {
      this.showUnableGetPhotoAlert();
      return;
    }
    // Convert it to base64 string from File
    const fr = new FileReader();

    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
    };

    fr.readAsDataURL(pickedFile);
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable("Camera") || this.usePicker) {
      this.filePickerRef.nativeElement.click(); // Do what file picker normally does (Like select a file in the browser)
      // this.showUnableGetPhotoAlert(); // Commented. Using fallback option
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

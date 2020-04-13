import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LocationPickerComponent } from "./pickers/location-picker/location-picker.component";
import { MapModalComponent } from "./map-modal/map-modal.component";
import { IonicModule } from "@ionic/angular";

import { AgmCoreModule } from "@agm/core";
import { ImagePickerComponent } from "./pickers/image-picker/image-picker.component";

@NgModule({
  declarations: [
    LocationPickerComponent,
    MapModalComponent,
    ImagePickerComponent,
  ], // Declare this components to be recognized by Angular
  imports: [
    CommonModule, // To be able to use Angular such as *ngIf and etc.
    IonicModule, // To be able to use Ionic such ion-button, ion-header and etc.
    AgmCoreModule,
  ],
  exports: [LocationPickerComponent, MapModalComponent, ImagePickerComponent], // Export these components so it can be used by other parts of the Angular application.
  entryComponents: [MapModalComponent], // To tell Angular to must loaded these components if anyone importing this SharedModule *VERY IMPORTANT*
})
export class SharedModule {}

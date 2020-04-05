import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { MapModalComponent } from './map-modal/map-modal.component';



@NgModule({
  declarations: [LocationPickerComponent, MapModalComponent], // Declare this components to be recognized by Angular
  imports: [
    CommonModule // To be able to use *ngIf and etc. Anything Angular.
  ],
  exports: [LocationPickerComponent, MapModalComponent] // Export these components so it can be used by other parts of the Angular application.
})
export class SharedModule { }

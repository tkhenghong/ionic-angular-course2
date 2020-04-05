import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaceDetailPageRoutingModule } from './place-detail-routing.module';

import { PlaceDetailPage } from './place-detail.page';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceDetailPageRoutingModule,
    SharedModule
  ],
  // Add CreateBookingComponent model into the declarations and entryComponents
  declarations: [PlaceDetailPage, CreateBookingComponent], // Put declaration of CreateBookingComponent in here, so it's only loaded when PlaceDetailPage is loaded
  // Tell Angular to be prepared to render CreateBookingComponent when the user requires it
  entryComponents: [CreateBookingComponent]
  
})
export class PlaceDetailPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewOfferPageRoutingModule } from './new-offer-routing.module';

import { NewOfferPage } from './new-offer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewOfferPageRoutingModule,
    ReactiveFormsModule, // Angular Reactive Forms Module. Used for building Angular Reactive forms.
  ],
  declarations: [NewOfferPage]
})
export class NewOfferPageModule {}

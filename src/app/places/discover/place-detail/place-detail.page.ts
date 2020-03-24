import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  constructor(
    // Ways to navigate in Ionic application
      // 1st method: Router method
      private router: Router,

      // 2nd method: NavController
      private navCtrl: NavController,
  ) { }

  ngOnInit() {
  }

  onBookPlace() {
    // 1st method: Router method
    // But it plays wrong animation (plays forward)
    // this.router.navigateByUrl('/places/tabs/discover');

    // 2nd method: NavController (url in array form also can)
    this.navCtrl.navigateBack('/places/tabs/discover');

    // If you can guarantee there's always a page that you can go back, then use it. Otherwise, better use navigateBack() method
    // this.navCtrl.pop();
  }

}

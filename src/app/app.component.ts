import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AuthService } from "./auth/auth.service";
import { Router } from "@angular/router";

import { Plugins, Capacitor } from '@capacitor/core';

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,

    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    // Check what platform that this app is running on.
    console.log('this.platform.is(\'hybrid\'): ', this.platform.is('hybrid'));
    this.platform.ready().then(() => {


      // Don't want to use these, using Capacitor to set splash screens
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();

      // Use capacitor to close the splash screen
      if(Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }


      this.platform.backButton.subscribeWithPriority(0, () => {
        navigator["app"].exitApp();
      });
    });
  }

  // Should invalidate the the sessions/tokens, clear storage and route to the login page
  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl("/auth");
  }
}

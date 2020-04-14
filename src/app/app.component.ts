import { Component, OnInit, OnDestroy } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AuthService } from "./auth/auth.service";
import { Router } from "@angular/router";

import { Plugins, Capacitor } from "@capacitor/core";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;
  private previousAuthState = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,

    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    // Implement logout
    this.authSubscription = this.authService.userIsAuthenticated.subscribe(
      (isAuth) => {
        if (!isAuth && this.previousAuthState !== isAuth) {
          this.router.navigateByUrl("/auth");
        }

        this.previousAuthState = isAuth;
      }
    );
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  initializeApp() {
    // Check what platform that this app is running on.
    console.log("this.platform.is('hybrid'): ", this.platform.is("hybrid"));
    this.platform.ready().then(() => {
      // Don't want to use these, using Capacitor to set splash screens
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();

      // Use capacitor to close the splash screen
      if (Capacitor.isPluginAvailable("SplashScreen")) {
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

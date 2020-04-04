import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  // Ionic does a lot in the hiding
  // In package.json, they created an Angular project for us. But it also added a lot of Ionic dependencies
  // After that, they brought in the IonicModule here to call the web components from those dependencies
  // This is what you need if you didn't bring the CDN link to your app like previous ionic-angular-course project
  // @ionic/angular: A wrapper inside got Ionic Component Suit wrapped by Angular to it can be used easier. So you
  // can use Ionic but use Angular in those components.
  // Ionic stuffs >> Create a Angular directive with defined properties to allow end user to access them >>
  // Declares and Exports them in ionic.module.ts (go search ionic/angular/src/ionic-module.ts)
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { Injectable } from "@angular/core";
import { CanLoad, Router, CanActivate } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

// Build a guard to prevent other users access to places and bookings pages
// Attach this guard into app.routing.module.ts file. Go see that file.
@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  // In Ionic 4, this canActivate method that automatically be generated.
  // But in Ionic 5 CLI, the tool will ask you which one to be imported and implemented
  // canActivate, canActivateChild, canLoad
  // So, choose canActivate() by default.

  // But this method is wrong implementation in our situation, because we want to prevent user accessed into places and bookings but
  // Both of PlacesModule and BookingsModule is LAZY LOADED. Those modules will be loaded even BEFORE the AuthGuard is loaded.
  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ):
  //   | Observable<boolean | UrlTree>
  //   | Promise<boolean | UrlTree>
  //   | boolean
  //   | UrlTree {
  //   return true;
  // }

  constructor(private authService: AuthService, private router: Router) {}

  // We must use canLoad() method to load this AuthGuard BEFORE those modules are loaded****
  // PROBLEM: This implementation is causing serious problem in Angular router: error cannot split of undefined.
  // Commented to use back the canActivate method.
  // canLoad(
  //   route: import("@angular/router").Route,
  //   segments: import("@angular/router").UrlSegment[]
  // ): boolean | Observable<boolean> | Promise<boolean> {
  //   // throw new Error("Method not implemented.");

  //   if (!this.authService.userIsAuthenticated) {
  //     // Redirects the user to the login page.
  //     this.router.navigateByUrl("/auth");
  //   }

  //   // Block the navigation
  //   return this.authService.userIsAuthenticated;
  // }

  // https://medium.com/@ryanchenkie_40935/angular-authentication-using-route-guards-bf7a4ca13ae3
  canActivate(): boolean {
    if (!this.authService.userIsAuthenticated) {
      // Redirects the user to the login page.
      this.router.navigateByUrl("/auth");
      return false;
    }

    // Block the navigation
    return true;
  }
}
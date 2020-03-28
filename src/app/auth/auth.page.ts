import { Component, OnInit } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"]
})
export class AuthPage implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  onLogin() {
    this.authService.login(); // Authenticate
    // this.router.navigateByUrl("/places/discover"); // Go to main page (Commented due to still can go back to Login page)
    
    // Problem: the use still can go back to the Login page after login. (Both iOS and Android)
    // Solution: Set the following page into the root page after login authenticated.
    // https://stackoverflow.com/questions/51427689/angular-5-remove-route-history
    this.router.navigate(["/", "places", "discover"], { replaceUrl: true }); // Set the Discover page as the first page in the stack navigation.
  }
}

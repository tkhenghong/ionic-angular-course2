import { Component, OnInit } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { LoadingController, AlertController } from "@ionic/angular";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"],
})
export class AuthPage implements OnInit {
  isLoading: boolean = false;
  isLogin: boolean = true; // Check the user is logged in or not.
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  async authenticate(email: string, password: string) {
    this.isLoading = true;
    this.authService.login(); // Authenticate
    // Use LoadingController
    const loadingElement = await this.loadingController.create({
      keyboardClose: true,
      message: "Logging in...",
    });
    await loadingElement.present();
    this.authService.signUp(email, password).subscribe(
      (resData) => {
        console.log("auth.page.ts resData: ", resData);
        // Problem: the use still can go back to the Login page after login. (Both iOS and Android)
        // Solution: Set the following page into the root page after login authenticated.
        // https://stackoverflow.com/questions/51427689/angular-5-remove-route-history
        // We want to add a spinner here to show UX that the app is working.
        this.isLoading = false;
        loadingElement.dismiss();
        this.router.navigate(["/", "places", "discover"], { replaceUrl: true }); // Set the Discover page as the first page in the stack navigation.
      },
      async (err) => {
        await loadingElement.dismiss();
        // You can catch error of the sign up like this
        console.log("auth.page.ts err: ", err);
        const errMessage = err.error.error.message;
        let message: string = "Could not sign you up. Please try again.";

        if (errMessage === "EMAIL_EXISTS") {
          message = "This email address already exists!";
        }

        this.showAlert(message);
      }
    );
  }

  // Angular Template driven form: Get the whole form from the HTML page and access the form elements from there.
  onSubmit(f: NgForm) {
    console.log("auth.page.ts onSubmit()");
    console.log("auth.page.ts f: ", f);
    console.log("auth.page.ts f.controls: ", f.controls);

    if (!f.valid) {
      return;
    }

    const email = f.value.email;
    const password = f.value.password;

    console.log("auth.page.ts email: ", email);
    console.log("auth.page.ts password: ", password);

    this.authenticate(email, password);
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  private async showAlert(message: string) {
    const alertEl = await this.alertController.create({
      header: "Authentication failed.",
      message: message,
      buttons: [
        {
          text: "Ok",
          role: "cancel",
        },
      ],
    });

    await alertEl.present();
  }
}

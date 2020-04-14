import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string; // Give us a token that will be used to refresh the token. By default the idToken will expire in 1 hour.
  expiresIn: string; // Tells you expiration time.
  localId: string; // Firebase auto assigns ID in for every signed up user.
  registered?: boolean; // This is a property when used in Login. Determine whether this user is a registered user or not.
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private _userIsAuthenticated = false;
  private _userId = null;

  private signUpApiURL: string = environment.signUpApiURL;

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  get userId() {
    return this._userId;
  }

  constructor(private httpClient: HttpClient) {}

  login() {
    this._userIsAuthenticated = true;
  }

  logout() {
    this._userIsAuthenticated = false;
  }

  // Learn how to use Google Auth REST API easily. https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
  signUp(email: string, password: string) {
    // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

    return this.httpClient.post<AuthResponseData>(this.signUpApiURL, {
      email,
      password,
      returnSecureToken: true,
    });
  }
}

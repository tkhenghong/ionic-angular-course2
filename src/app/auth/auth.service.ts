import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BehaviorSubject, from } from "rxjs";
import { User } from "./user.model";
import { map, tap } from "rxjs/operators";
import { Capacitor, Plugins } from "@capacitor/core";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string; // Give us a token that will be used to refresh the token. By default the idToken will expire in 1 hour.
  expiresIn: string; // Tells you expiration time.
  localId: string; // Firebase auto assigns ID in for every signed up user.
  registered?: boolean; // This is a property when used in Login. Determine whether this user is a registered user or not.
}

export interface AuthStorageToken {
  token: string;
  userId: string;
  tokenExpirationDate: string;
  email: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private _user = new BehaviorSubject<User>(null);

  private signUpApiURL: string = environment.signUpApiURL;
  private signInApiURL: string = environment.signInApiURL;

  public get currentUserValue(): User {
    return this._user.value;
  }

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map((user) => {
        const userIsAuthenticated: boolean = user ? !!user.token : false;

        // If got user, return user token exist or not, else return false
        return userIsAuthenticated; // <--- Convert value to boolean
      })
    );
  }

  public isUserAuthenticated() {
    return this._user.value;
  }

  get userId() {
    return this._user.asObservable().pipe(
      map((user) => {
        // If got user in Observable, return userId, else return nothing.
        return user ? user.id : null;
      })
    );
  }

  constructor(private httpClient: HttpClient) {}

  login(email: string, password: string) {
    return this.httpClient
      .post<AuthResponseData>(this.signInApiURL, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(tap(this.setUserData.bind(this))); // Straight get the data and put it into a function. // bind(this) is used to only limit the subscribe scope to this class only.
  }

  logout() {
    this._user.next(null);
  }

  private setUserData(userData: AuthResponseData) {
    // new Date().getTime() is milisecond
    // +userData.expiresIn * 1000 is to convert from seconds to miliseconds
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    this._user.next(
      new User(
        userData.localId,
        userData.email,
        userData.idToken,
        expirationTime
      )
    );

    this.storeAuthData(
      userData.localId,
      userData.idToken,
      expirationTime.toISOString(),
      userData.email
    );
  }

  // Learn how to use Google Auth REST API easily. https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
  signUp(email: string, password: string) {
    // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

    return this.httpClient
      .post<AuthResponseData>(this.signUpApiURL, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(tap(this.setUserData.bind(this))); // bind(this) is used to only limit the subscribe scope to this class only.
  }

  // Using Capacitor Storage to store data (Like using localStorage)
  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string
  ) {
    const authStorageToken: AuthStorageToken = {
      userId,
      token,
      tokenExpirationDate,
      email,
    };
    const data: string = JSON.stringify(authStorageToken);
    Plugins.Storage.set({ key: "authData", value: data });
  }

  // This will try to fetch data from Capacitor Storage and see the token expired or not
  autoLogin() {
    // Convert Promise to Observable***
    return from(Plugins.Storage.get({ key: "authData" })).pipe(
      map((storedData) => {
        if (!storedData || !storedData.value) {
          return null;
        }

        const parsedData = JSON.parse(storedData.value) as AuthStorageToken;

        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          // If token expired
          return null;
        }

        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime
        );
        return user;
      }),
      tap(user => {
        if(user) {
          // Set the user
          this._user.next(user);
        }
      }),
      map(user => {
        // convert object to boolean
        return !!user;
      })
    );
  }
}

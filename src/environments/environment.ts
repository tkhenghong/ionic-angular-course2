// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  databaseURL: "https://ionic-angular-course-e937d.firebaseio.com",
  googleMapAPIKey: "AIzaSyAIgSXeSLo8zNkS5Qko6cPVP0SELR0AZYU",
  satelliteImageWidth: 500,
  satelliteImageHeight: 300,
  satelliteImageZoom: 14,
  photoHeight: 800,
  photoWidth: 600,
  signUpApiURL: 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAIgSXeSLo8zNkS5Qko6cPVP0SELR0AZYU',
  signInApiURL: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAIgSXeSLo8zNkS5Qko6cPVP0SELR0AZYU'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

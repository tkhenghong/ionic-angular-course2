# ionic-angular-course2
Ionic Angular Project for Build Ionic Apps, from Chapter 3 of Ionic 4 course by Maximilian Schwarzmüller.


Backend URL(Test mode): https://ionic-angular-course-e937d.firebaseio.com/

This project also uses Firebase Tools in order to upload photos to Firebase Storage.
Setup Firebase Tool CLI URL: https://firebase.google.com/docs/cli
Learn how to use Firebase Cloud functions, starting point: https://firebase.google.com/docs/functions/?authuser=0#implementation_paths

From now on, to access DB and upload/download image from Firebase needs token.
Firebase Database Rule: 
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "bookings":{
      ".indexOn": ["userId"]
    }
  }
}

Firebase Storage Rule: 
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}

Change to Custom App Icons for iOS and Android:

https://medium.com/@dalezak/generate-app-icon-and-splash-screen-images-for-ionic-framework-using-capacitor-e1f8c6ef0fd4
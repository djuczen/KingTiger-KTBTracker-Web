// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { NgxLoggerLevel } from "ngx-logger";

export const environment = {
  production: false,
  logLevel: NgxLoggerLevel.DEBUG,
  serverLogLevel: NgxLoggerLevel.OFF,
  firebase: {
    apiKey: "AIzaSyDJvlg2IvnLKte4uhA-PicN5Eibr6cdDPE",
    authDomain: "ktbtracker-1659484356633.firebaseapp.com",
    projectId: "ktbtracker-1659484356633",
    storageBucket: "ktbtracker-1659484356633.appspot.com",
    messagingSenderId: "605352235793",
    appId: "1:605352235793:web:42346a08b24cd3786b72b0",
    measurementId: "G-QB3J6TD92Y"
  },
  api: {
    url: ''
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

import { NgxLoggerLevel } from "ngx-logger";

export const environment = {
  production: true,
  logLevel: NgxLoggerLevel.OFF,
  serverLogLevel: NgxLoggerLevel.ERROR,
  firebase: {
    apiKey: "AIzaSyDJvlg2IvnLKte4uhA-PicN5Eibr6cdDPE",
    authDomain: "ktbtracker-1659484356633.firebaseapp.com",
    projectId: "ktbtracker-1659484356633",
    storageBucket: "ktbtracker-1659484356633.appspot.com",
    messagingSenderId: "605352235793",
    appId: "1:605352235793:web:42346a08b24cd3786b72b0",
    measurementId: "G-QB3J6TD92Y"
  },
  recaptcha: {
    siteKey: '6Lc2egIkAAAAAAIY11Ak8pdCaoGwmt4oQefhrtbh',
  },
  api: {
    url: ''
  }
};

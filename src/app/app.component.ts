import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '@core/config/firebase.config';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'web-ui';
  public isLoggedIn = false;

  constructor(
  ) {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
  }


  ngOnInit(): void {

  }

  
}

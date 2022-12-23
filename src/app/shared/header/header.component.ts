import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: any | undefined;

  constructor(
    private router: Router,
    private firebaseAuth: AngularFireAuth
  ) {
    this.firebaseAuth.authState
      .subscribe((user) => {
        this.user = user;
      });
   }

  ngOnInit(): void {

  }

  logout() {
    console.debug(`[DEBUG] Logging out...`)
    this.firebaseAuth.signOut();
    this.router.navigate(['sign-in']);
  }
}

import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'ktb-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  headerLogo: string = 'assets/images/kta-logo.png';

  user: any | undefined;

  constructor(
    private router: Router,
    private firebaseAuth: AngularFireAuth
  ) {
    if (window.matchMedia('(prefers-color-scheme: dark)').media === 'dark') {
      this.headerLogo = 'assets/images/ktb-logo-dark.ping';
    }

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

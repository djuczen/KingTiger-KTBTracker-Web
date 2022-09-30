import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;

  constructor(
    public fireauth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.authStateListener();
   }

  authStateListener() {
    this.fireauth.onAuthStateChanged((fireUser) => {
      if (fireUser) {
        this.userData = fireUser;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
        console.log('onAuthStateChanged: logged in', fireUser.email);
      } else {
        localStorage.removeItem('user');
        JSON.parse(localStorage.getItem('user')!);
        console.log('onAuthStateChanged: logged out!');
      }
    });
  }

  get isAuthenticated(): boolean {
    console.log('AuthService: user', localStorage.getItem('user'));
    const user = JSON.parse(localStorage.getItem('user')!);
    console.log('AuthService: isAuthenticated - user', user);
    return user !== null && user.emailVerified !== false ? true : false;
  }


  createUserWithEmailAndPassword = (email: string, password: string) => {
    return this.fireauth.createUserWithEmailAndPassword(email, password);
  }

  signInWithEmailAndPassword = (email: string, password: string) => {
    return this.fireauth.signInWithEmailAndPassword(email, password);
  }
}

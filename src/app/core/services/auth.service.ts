import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: any;

  constructor(
    public auth: AngularFireAuth
  ) {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        window.localStorage.setItem('user', JSON.stringify(user));
      } else {
        window.localStorage.setItem('user', 'null');
        JSON.parse(window.localStorage.getItem('user')!);
      }
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(window.localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }
}

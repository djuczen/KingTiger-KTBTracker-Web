import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { User as FirebaseUser } from "firebase/auth";
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  currentUser: FirebaseUser | null;

  constructor(private auth: AngularFireAuth) {
    this.currentUser = null;
    this.auth.user.subscribe((user) => {
      console.log('AuthInteceptor user...', user);
      if (user) {
        this.currentUser = user as FirebaseUser;
      }
    });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.auth.idToken.pipe(
      take(1),
      switchMap((token: any) => {
        console.log('AuthInterceptor (token)...', token);
        if (token) {
          request = request.clone({
            setHeaders: { 'Authorization': `Bearer ${token}`}
          });
        }
        console.log('AuthInterceptor...', request);
        return next.handle(request);
      })
    );
  }
}

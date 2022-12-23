import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  constructor(
    private logger: NGXLogger,
    private firebaseAuth: AngularFireAuth
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.firebaseAuth.idToken
      .pipe(
        take(1),
        switchMap((idToken) => {
          let clone = request.clone();
          if (idToken) {
            this.logger.debug(`Injecting Bearer Token`, idToken);
            clone = clone.clone({ headers: request.headers.set('Authorization', 'Bearer ' + idToken)});
          }
          return next.handle(clone);
        })
      );

  }
}

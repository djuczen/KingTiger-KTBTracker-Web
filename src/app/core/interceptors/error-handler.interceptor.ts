import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(private logger: NGXLogger) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.logger.error(`ErrorHandlerInterceptor: ${error.status} ${error.statusText}`, error.error);
          return throwError(() => error);
        })
      );
  }
}

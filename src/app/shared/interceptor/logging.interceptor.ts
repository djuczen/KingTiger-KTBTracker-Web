import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { finalize, Observable, tap } from 'rxjs';


@Injectable()
export class LoggingInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const started = Date.now();
    let ok: string;

    console.log(`Request  ${request.method} "${request.urlWithParams}...`);

    return next.handle(request)
      .pipe(
        tap({
          next: (event) => {
            ok = event instanceof HttpResponse ? 'Succeeded' : '';
            if (event instanceof HttpResponse) {
              const response = event as HttpResponse<any>;
              console.log(`Response ${request.method} "${request.urlWithParams}`);
              console.log(`Status ${response.status} ${response.statusText}`);
              console.log(`Body: ${response.body}`);
            }
          },
          error: (error) => { 
            ok = 'Failed';
            console.log(`Request  ${request.method} "${request.urlWithParams}`);
            console.log(`Error: ${error}`);
          }
        }),
        finalize(() => {
          const elapsed = Date.now() - started;
          console.log(`${ok} in ${elapsed} ms`);
        })
      );
  }
}

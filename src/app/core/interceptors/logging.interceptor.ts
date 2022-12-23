import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { finalize, Observable, tap } from 'rxjs';
import { NGXLogger } from 'ngx-logger';


@Injectable()
export class LoggingInterceptor implements HttpInterceptor {

  constructor(
    private logger: NGXLogger
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const started = Date.now();
    let ok: string;

    this.logger.debug(`Request  ${request.method} "${request.urlWithParams}...`);

    return next.handle(request)
      .pipe(
        tap({
          next: (event) => {
            ok = event instanceof HttpResponse ? 'Succeeded' : '';
            if (event instanceof HttpResponse) {
              const response = event as HttpResponse<any>;
              this.logger.debug(`Response ${request.method} "${request.urlWithParams}`);
              this.logger.debug(`Status ${response.status} ${response.statusText}`);
              this.logger.debug(`Body: ${response.body}`);
            }
          },
          error: (error) => { 
            ok = 'Failed';
            this.logger.debug(`Request  ${request.method} "${request.urlWithParams}`);
            this.logger.debug(`Error: ${error}`);
          }
        }),
        finalize(() => {
          const elapsed = Date.now() - started;
          this.logger.debug(`${ok} in ${elapsed} ms`);
        })
      );
  }
}

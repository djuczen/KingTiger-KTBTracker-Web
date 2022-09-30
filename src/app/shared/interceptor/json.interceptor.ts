import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable()
export abstract class JsonParser {
  abstract parse(text: string): any;
}

@Injectable()
export class JsonInterceptor implements HttpInterceptor {

  constructor(private parser: JsonParser) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.responseType === 'json') {
      return this.handleJsonResponse(request, next);
    } else {
      return next.handle(request);
    }
  }

  private handleJsonResponse(request: HttpRequest<any>, next: HttpHandler) {
    request = request.clone({responseType: 'text'});
    return next.handle(request).pipe(map((event) => this.parseJsonResponse(event)));
  }

  private parseJsonResponse(event: HttpEvent<any>) {
    if (event instanceof HttpResponse && typeof event.body === 'string') {
      return event.clone({body: this.parser.parse(event.body)});
    } else {
      return event;
    }
  }
}

@Injectable()
export class CustomJsonParser implements JsonParser {
  parse(text: string) {
    return JSON.parse(text, reviver);
  }
}

function reviver(key: string, value: any) {
  console.log(`${key}=${value}`);

  return value;
}

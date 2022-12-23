import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Instant, LocalDate, LocalDateTime, ZoneId, ZoneOffset } from '@js-joda/core';

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

/**
 * A custom JSON.parse reviver function that supports LocalDate and LocalDateTime in the 
 * ISO9601 format uuuu-MM-dd'T'HH:mm:ss'Z'.
 * 
 * @param key the key for the object attribute being deserialized
 * @param value the value for the object attribute being deserialized
 * @returns the attribute value
 */
export function reviver(key: string, value: any) {
  //console.log(`reviver: (${typeof value}) ${key}=${value}`);

  // Cycle Dates ... LocalDate
  if (key === 'cycleStart' || key === 'cycleEnd' || key === 'cyclePreStart' || key === 'cyclePostEnd') {
    return LocalDate.parse(value.toString());
  }

  // Metadata ... LocalDateTime (converted from UTC - ISO_INSTANT format)
  if (key === 'created' || key === 'modified') {
    //console.log('LocalDateTime<-string', LocalDateTime.ofInstant(Instant.parse(value), ZoneId.systemDefault()), value);
    return LocalDateTime.ofInstant(Instant.parse(value), ZoneId.systemDefault());
  }
  return value;
}

/**
 * A custom JSON.stringify replacer function that supports LocalDateTime in the 
 * ISO9601 format uuuu-MM-dd'T'HH:mm:ss'Z'.
 * 
 * @param key the key for the object attribute being serialized
 * @param value the value for the object attribute being serialized
 * @returns the string representation of the attribute value
 */
export function replacer(key: string, value: any) {
  //console.log(`replacer: (${typeof value}) ${key}=${value}`);

    // Metadata ... LocalDateTime (converted to UTC - ISO_INSTANT format)
    if (key === 'created' || key === 'modified') {
      //console.log('string<-LocalDateTime', LocalDateTime.parse(value).atZone(ZoneOffset.systemDefault()).toInstant().toString(), value);
      return LocalDateTime.parse(value).atZone(ZoneOffset.systemDefault()).toInstant().toString();
    }
    return value;
}
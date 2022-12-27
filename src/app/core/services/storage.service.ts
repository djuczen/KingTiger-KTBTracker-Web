import { Injectable } from '@angular/core';
import { replacer, reviver } from '@core/interceptors/json.interceptor';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private logger: NGXLogger) { }

  public getItem<T>(key: string): T | null;
  public getItem<T>(key: string, otherwise: T): T;
  public getItem<T>(key: string, otherwise?: T): T | null {
    const data: string | null = window.sessionStorage.getItem(key);
    this.logger.debug(`getItem(${key})`, data);

    if (data !== null) {
      return JSON.parse(data, reviver) as T;
    }

    if (otherwise) {
      return otherwise;
    }

    return null;
  }

  public setItem(key: string, data: any): void {
    this.logger.debug(`setItem(${key})`, data);
    window.sessionStorage.setItem(key, JSON.stringify(data, replacer));
  }
}

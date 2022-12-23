import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Cycle } from '../interfaces/cycle';
import { map, Observable } from 'rxjs';

import { environment } from '@environment/environment';


@Injectable({
  providedIn: 'root'
})
export class CyclesService {
  currentUser: any;

  constructor(
    private http: HttpClient
  ) {

  }

  getCyclesCount(): Observable<number> {
    return this.http.head<any>(`${environment.api.url}/api/cycles`)
      .pipe(
        map((response: HttpResponse<any>) => {
          return parseInt(response.headers.get('X-API-Query-Count') || '0');
        })
      );
  }

  getCycles(): Observable<Cycle[]> {
    return this.http.get<Cycle[]>(`${environment.api.url}/api/cycles`);
  }

  getCycle(id: number | string): Observable<Cycle> {
    return this.http.get<Cycle>(`${environment.api.url}/api/cycles/${id}`);
  }

  getCurrentCycle(): Observable<Cycle> {
    return this.http.get<Cycle>(`${environment.api.url}/api/cycles/current`);
  }
}

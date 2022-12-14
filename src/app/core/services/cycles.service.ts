import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Cycle } from '../interfaces/cycle';
import { map, Observable } from 'rxjs';

import { environment } from '@environment/environment';
import { NGXLogger } from 'ngx-logger';


@Injectable({
  providedIn: 'root'
})
export class CyclesService {
  currentUser: any;

  constructor(
    private logger: NGXLogger,
    private http: HttpClient
  ) {

  }

  getCyclesCount(): Observable<number> {
    return this.http.head<any>(`/api/cycles`)
      .pipe(
        map((response: HttpResponse<any>) => {
          return parseInt(response.headers.get('X-API-Query-Count') || '0');
        })
      );
  }

  getCycles(): Observable<Cycle[]> {
    return this.http.get<Cycle[]>(`${environment.api.url}/api/cycles`);
  }

  public getCycle(cycleId?: number | string): Observable<Cycle> {
    this.logger.debug('getCycle(...)', cycleId);
    return this.http.get<Cycle>(`/api/cycles/${cycleId || 'current'}`);
  }

  getCurrentCycle(): Observable<Cycle> {
    return this.http.get<Cycle>(`/api/cycles/current`);
  }

  updateCycle(cycle: Cycle): Observable<Cycle> {
    if (cycle.id) {
      return this.http.put<Cycle>(`/api/cycles/${cycle.id}`, cycle);
    }
    return this.http.post<Cycle>(`/api/cycles`, cycle);
  }
}

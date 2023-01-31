import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Cycle } from '../interfaces/cycle';
import { map, Observable, of, tap } from 'rxjs';

import { environment } from '@environment/environment';
import { NGXLogger } from 'ngx-logger';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class CyclesService {
  currentUser: any;

  constructor(
    private logger: NGXLogger,
    private http: HttpClient,
    private storageService: StorageService
  ) {

  }

  public getCyclesCount(): Observable<number> {
    return this.http.head<any>(`/api/cycles`)
      .pipe(
        map((response: HttpResponse<any>) => {
          return parseInt(response.headers.get('X-API-Query-Count') || '0');
        })
      );
  }

  public getCycles(): Observable<Cycle[]> {
    return this.http.get<Cycle[]>(`/api/cycles`);
  }

  public getCycle(cycleId?: number | string): Observable<Cycle> {
    this.logger.debug('getCycle(...)', cycleId);
    const currentCycle =this.storageService.getItem<Cycle>('current_cycle');
    if (currentCycle != null && (cycleId && (cycleId == 'current' || currentCycle?.id == cycleId))) {
      return of(currentCycle);
    }
    return this.http.get<Cycle>(`/api/cycles/${cycleId || 'current'}`)
      .pipe(
        map((cycle) => new Cycle(cycle)),
        tap(cycle => this.storageService.setItem('current_cycle', cycle)),
        tap(cycle => this.logger.debug('getCycle:', cycle))
      );
  }

  public getCurrentCycle(): Observable<Cycle> {
    return this.getCycle('current');
  }

  public createCycle(cycle: Cycle): Observable<Cycle> {
    return this.updateCycle(cycle);
  }

  public updateCycle(cycle: Cycle): Observable<Cycle> {
    if (cycle.id) {
      return this.http.put<Cycle>(`/api/cycles/${cycle.id}`, cycle);
    }
    return this.http.post<Cycle>(`/api/cycles`, cycle);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Cycle } from '../model/cycle';
import { map, Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class CyclesService {
  currentUser: any;

  constructor(
    private http: HttpClient,
    private auth: AngularFireAuth
  ) {
    this.auth.user.subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
    });
  }

  getCyclesCount(): Observable<number> {
    return this.http.head<any>(`/api/cycles`)
      .pipe(
        map((response: HttpResponse<any>) => {
          return parseInt(response.headers.get('X-Total-Count') || '0');
        })
      );
  }

  getCycles(): Observable<Cycle[]> {
    return this.http.get<Cycle[]>(`/api/cycles`);
  }
  getCycle(id: number): Observable<Cycle> {
    return this.http.get<Cycle>(`/api/cycles/${id}`);
  }

  getCurrentCycle(): Observable<Cycle> {
    return this.http.get<Cycle>(`/api/cycles/current`);
  }
}

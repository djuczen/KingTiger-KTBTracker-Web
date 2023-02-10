import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

import { Candidate } from '@core/interfaces/candidate';
import { Cycle } from '@core/interfaces/cycle';
import { NGXLogger } from 'ngx-logger';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class CandidatesService {

  constructor(
    private logger: NGXLogger,
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  public getCandidates(cycle?: Cycle | null): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`/api/cycles/${cycle?.id || 'current'}/candidates`);
  }

  public getCurrentCandidate(cycle?: Cycle | null): Observable<Candidate> {
    const currentCandidate = this.storageService.getItem<Candidate>('current_candidate');
    if (currentCandidate != null) {
      return of(currentCandidate);
    }
    return this.http.get<Candidate>(`/api/cycles/${cycle?.id || 'current'}/candidates/me`)
      .pipe(
        tap(candidate => this.storageService.setItem('current_candidate', candidate)),
      );
  }

  public getCandidate(candidateId?: number | string): Observable<Candidate> {
    const currentCandidate = this.storageService.getItem<Candidate>('current_candidate');
    if (currentCandidate != null && (currentCandidate.id == (candidateId || 0))) {
      return of(currentCandidate);
    }
    return this.http.get<Candidate>(`/api/candidates/${candidateId || '0'}`)
    .pipe(
      tap(candidate => {
        const currentCandidate = this.storageService.getItem<Candidate>('current_candidate');
        if (currentCandidate == null || (currentCandidate != null && currentCandidate.userId == candidate.userId)) {
          this.storageService.setItem('current_candidate', candidate);
        }
      })
    );
  }

  public createCandidate(candidate: Candidate): Observable<Candidate> {
    return this.http.post<Candidate>(`/api/candidates`, candidate)
      .pipe(
        tap(candidate => {
          const currentCandidate = this.storageService.getItem<Candidate>('current_candidate');
          if (currentCandidate == null || (currentCandidate != null && currentCandidate.userId == candidate.userId)) {
            this.storageService.setItem('current_candidate', candidate);
          }
        })
      );
  }
}

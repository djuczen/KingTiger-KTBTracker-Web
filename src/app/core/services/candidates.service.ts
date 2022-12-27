import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

import { Candidate } from '@core/interfaces/candidate';
import { Cycle } from '@core/interfaces/cycle';
import { NGXLogger } from 'ngx-logger';


@Injectable({
  providedIn: 'root'
})
export class CandidatesService {

  constructor(
    private logger: NGXLogger,
    private http: HttpClient
  ) { }

  getCandidates(cycle?: Cycle | null): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`/api/cycles/${cycle?.id || 'current'}/candidates`);
  }

  getCurrentCandidate(cycle?: Cycle | null): Observable<Candidate> {
    return this.http.get<Candidate>(`/api/cycles/${cycle?.id || 'current'}/candidates/me`)
      .pipe(catchError(this.handleError));
  }

  getCandidate(candidateId?: number | string): Observable<Candidate> {
    return this.http.get<Candidate>(`/api/candidates/${candidateId || '0'}`);
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown Error';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
    }
    this.logger.error(errorMessage);
    return throwError(errorMessage);
  }
}

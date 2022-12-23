import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { Candidate } from '@core/interfaces/candidate';
import { Cycle } from '@core/interfaces/cycle';


@Injectable({
  providedIn: 'root'
})
export class CandidatesService {

  constructor(private http: HttpClient) { }

  getCandidates(cycle: Cycle | undefined): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`/api/cycles/${cycle?.id || 'current'}/candidates`);
  }

  getCurrentCandidate(cycle: Cycle | undefined): Observable<Candidate> {
    return this.http.get<Candidate>(`/api/cycles/${cycle?.id || 'current'}/candidates/me`);
  }

  getCandidate(candidateId: number | string): Observable<Candidate> {
    return this.http.get<Candidate>(`/api/candidates/${candidateId}`);
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown Error';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}

import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { LocalDate } from '@js-joda/core';

import { CandidateTracking } from '@core/interfaces/candidate-tracking';
import { Candidate } from '@core/interfaces/candidate';
import { Tracking } from '@core/interfaces/tracking';
import { FullStatistics } from '@core/interfaces/full-statistics';


@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  constructor(private http: HttpClient) { }

 
  getCandidateTracking(candidate: Candidate | undefined, fromDate: LocalDate, toDate: LocalDate): Observable<CandidateTracking> {
    if (!candidate) {
      console.warn(`[WARN] No cycle/candidate requested!`);

    }
    const params = new HttpParams()
      .set('from_date', fromDate.toString())
      .set('to_date', toDate.toString());

    return this.http.get<CandidateTracking>(`/api/cycles/${candidate?.cycleId || 'current'}/candidates/${candidate?.id || 'me'}/tracking`, { params: params });
  }

  updateCandidateTracking(candidate: Candidate | undefined, tracking: Tracking): Observable<Tracking> {
    return this.http.put<Tracking>(`/api/cycles/${candidate?.cycleId || 'current'}/candidates/${candidate?.id || 'me'}/tracking/${tracking.trackingDate}`, tracking);
  }

  getCandidateStatistics(candidate: Candidate | undefined, scope: string = 'all'): Observable<FullStatistics> {
    return this.http.get<FullStatistics>(`/api/cycles/${candidate?.cycleId || 'current'}/candidates/${candidate?.id || 'me'}/statistics/full?scope=${scope}`);
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

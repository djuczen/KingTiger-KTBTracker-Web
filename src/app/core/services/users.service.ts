import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountInfo } from '@core/interfaces/account-info';
import { User } from '@core/interfaces/user';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`/api/users`);
  }
  
  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`/api/users/${userId}`);
  }

  getUserInfo(idToken?: string): Observable<AccountInfo> {
    return this.http.get<AccountInfo>(`/api/auth/getAccountInfo`);
  }

  public createUser(user: User): Observable<User> {
    return this.http.post<User>(`/api/users`, user);
  }

  private handleError(error: HttpErrorResponse) {
    console.error(`ERROR: ${error.status} ${error.statusText} - ${error.message}`);
    let errorMessage = '';

    if (error.status == 0) {
      errorMessage = `An error occurred:`, error.error;
    } else {
      errorMessage = `Backend returned ${error.status} ${error.statusText}, body was:`, error.error; 
    }
    errorMessage += 'Something bad happened. Please try again later.';
    return throwError(() => new Error(errorMessage));
  }
}

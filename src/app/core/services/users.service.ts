import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountInfo } from '@core/interfaces/account-info';
import { User } from '@core/interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`/api/users/${userId}`);
  }

  getUserInfo(idToken: string): Observable<AccountInfo> {
    return this.http.get<AccountInfo>(`/api/auth/getAccountInfo`);
  }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public auth: AuthService,
    public router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log('AuthGuard - isAuthenticated:', this.auth.isAuthenticated);

    if (this.auth.isAuthenticated !== true) {
      this.router.navigate(['sign-in'], { queryParams: { returnUrl: state.url } });
    }

    return true;
  }
  
}

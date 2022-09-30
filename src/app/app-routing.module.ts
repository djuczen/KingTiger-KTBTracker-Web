import { NgModule } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { AuthGuard } from './shared/guard/auth.guard';


const redirectUnauthorizedToLogin = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  console.log('redirectUnauthorizedToLogin...', next, state, `${state.url}`);
  return redirectUnauthorizedTo(`/sign-in?returnUrl=${state.url}`);
};

const redirectAuthorizedToNext = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  console.log('redirectAuthorizedToNext...', next.queryParams['returnUrl'] || '/');
  return redirectLoggedInTo([next.queryParams['returnUrl'] || '/']);
};

const routes: Routes = [
  {
    path: '', 
    redirectTo: '/dashboard', 
    pathMatch: 'full'
  },
  { 
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectAuthorizedToNext
    }
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'verify-email',
    component: VerifyEmailComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AngularFireAuthGuard], 
    data: { 
      authGuardPipe: redirectUnauthorizedToLogin
    } 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

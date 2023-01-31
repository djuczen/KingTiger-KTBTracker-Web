import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, hasCustomClaim, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { ActivityComponent } from './pages/activity/activity.component';
import { ClassesComponent } from './pages/classes/classes.component';
import { CandidatesComponent } from './pages/candidates/candidates.component';
import { CyclesComponent } from './pages/cycles/cycles.component';
import { UsersComponent } from './pages/users/users.component';
import { RegisterCredentialsComponent } from './pages/register/register-credentials/register-credentials.component';
import { RegisterCandidateInfoComponent } from './pages/register/register-candidate-info/register-candidate-info.component';


const adminOnly = () => hasCustomClaim('admin');
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);
const redirectUnauthorizedToRegistration = () => redirectUnauthorizedTo(['/register/credentials']);
const redirectLoggedInToRegistration= () => redirectLoggedInTo(['/register/candidate-info']);

const routes: Routes = [
  {
    path: '', 
    redirectTo: '/dashboard', 
    pathMatch: 'full'
  },
  { 
    path: 'sign-in',
    component: SignInComponent,

  },
  {
    path: 'register',
    component: RegisterComponent,
    children: [
      {
        path: '',
        redirectTo: 'credentials',
        pathMatch: 'full',
      },
      {
        title: 'Sign In Credentials',
        path: 'credentials',
        component: RegisterCredentialsComponent,
        canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLoggedInToRegistration }
      },
      {
        title: 'Candidate Information',
        path: 'candidate-info',
        component: RegisterCandidateInfoComponent,
        canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToRegistration }
      },
    ]
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
    path: 'activity',
    component: ActivityComponent,
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'classes',
    component: ClassesComponent,
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }

  },
  {
    path: 'cycles',
    component: CyclesComponent,
    canActivate: [AngularFireAuthGuard], data: { authGuardPage: redirectUnauthorizedToLogin }
  },
  {
    path: 'candidates',
    component: CandidatesComponent,
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

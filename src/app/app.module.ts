import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { LoggerModule } from 'ngx-logger';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '@environment/environment';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { HeaderComponent } from '@shared/header/header.component';
import { FooterComponent } from '@shared/footer/footer.component';
import { httpInterceptorProviders } from '@core/interceptors';
import { CustomJsonParser, JsonParser } from '@core/interceptors/json.interceptor';
import { ProgressMeterComponent } from '@shared/progress-meter/progress-meter.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivityChartComponent } from './shared/activity-chart/activity-chart.component';
import { ActivityComponent } from './pages/activity/activity.component';
import { ActivityEditorComponent } from './pages/activity/activity-editor/activity-editor.component';
import { RequirementsEditorComponent } from './shared/requirements-editor/requirements-editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocalDatePipe } from '@core/pipes/local-date.pipe';
import { CycleWeekHeaderComponent } from './shared/cycle-week-header/cycle-week-header.component';
import { RoundedPipe } from '@core/pipes/rounded.pipe';
import { ClassesComponent } from './pages/classes/classes.component';
import { CandidatesComponent } from './pages/candidates/candidates.component';
import { UsersComponent } from './pages/users/users.component';
import { CyclesComponent } from './pages/cycles/cycles.component';
import { EditButtonComponent } from './shared/edit-button/edit-button.component';
import { CycleEditorComponent } from './pages/cycles/cycle-editor/cycle-editor.component';
import { NgbDateAdapter, NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbLocalDateAdapter } from '@features/ngb-local-date-adapter';
import { InputNumericDirective } from '@shared/input-numeric.directive';
import { RecaptchaFormsModule, RecaptchaModule, RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { CoreModule } from '@core/core.module';
import { InfoDialogComponent } from './shared/info-dialog/info-dialog.component';
import { RegisterCredentialsComponent } from './pages/register/register-credentials/register-credentials.component';
import { RegisterCandidateInfoComponent } from './pages/register/register-candidate-info/register-candidate-info.component';
import { MaterialModule } from './material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SignInComponent,
    SignUpComponent,
    RegisterComponent,
    RegisterCredentialsComponent,
    RegisterCandidateInfoComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    HeaderComponent,
    FooterComponent,
    ProgressMeterComponent,
    ActivityChartComponent,
    ActivityComponent,
    ActivityEditorComponent,
    RequirementsEditorComponent,
    LocalDatePipe,
    CycleWeekHeaderComponent,
    RoundedPipe,
    ClassesComponent,
    CandidatesComponent,
    UsersComponent,
    CyclesComponent,
    EditButtonComponent,
    CycleEditorComponent,
    InputNumericDirective,
    InfoDialogComponent,
  ],
  imports: [
    CoreModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LoggerModule.forRoot({
      serverLoggingUrl: '/api/logs',
      level: environment.logLevel,
      serverLogLevel: environment.serverLogLevel,
    }),
    MaterialModule,
    // ...Firebase Modules...
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    RecaptchaV3Module,
    NgbModule,
    NgbDatepickerModule,
    FontAwesomeModule,
  ],
  providers: [
    httpInterceptorProviders,
    { provide: JsonParser, useClass: CustomJsonParser },
    { provide: NgbDateAdapter, useClass: NgbLocalDateAdapter },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptcha.siteKey },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

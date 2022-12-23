import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

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
import { SidebarComponent } from '@shared/sidebar/sidebar.component';
import { ProgressMeterComponent } from '@shared/progress-meter/progress-meter.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivityChartComponent } from './shared/activity-chart/activity-chart.component';
import { ActivityComponent } from './pages/activity/activity.component';
import { RequirementsEditorComponent } from './shared/requirements-editor/requirements-editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalDatePipe } from '@core/pipes/local-date.pipe';
import { CycleWeekHeaderComponent } from './shared/cycle-week-header/cycle-week-header.component';
import { RoundedPipe } from '@core/pipes/rounded.pipe';
import { ClassesComponent } from './pages/classes/classes.component';



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SignInComponent,
    SignUpComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ProgressMeterComponent,
    ActivityChartComponent,
    ActivityComponent,
    RequirementsEditorComponent,
    LocalDatePipe,
    CycleWeekHeaderComponent,
    RoundedPipe,
    ClassesComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LoggerModule.forRoot({
      serverLoggingUrl: '/api/logs',
      level: environment.logLevel,
      serverLogLevel: environment.serverLogLevel,
    }),
    // ...Firebase Modules...
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule
  ],
  providers: [
    httpInterceptorProviders,
    { provide: JsonParser, useClass: CustomJsonParser },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

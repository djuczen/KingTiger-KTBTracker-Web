import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, catchError, combineLatest, firstValueFrom, forkJoin, Observable, of, switchMap, tap, throwError } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import { Candidate } from '@core/interfaces/candidate';
import { Cycle } from '@core/interfaces/cycle';
import { PhysicalExam } from '@core/interfaces/physical-exam';
import { PersonNameComponents } from '@core/person-name-components';
import { CandidatesService } from '@core/services/candidates.service';
import { CyclesService } from '@core/services/cycles.service';
import { StorageService } from '@core/services/storage.service';
import { UsersService } from '@core/services/users.service';
import { InfoDialogComponent } from '@shared/info-dialog/info-dialog.component';
import { FirebaseError } from 'firebase/app';
import { ThisReceiver } from '@angular/compiler';
import { FormProvider } from '@features/form-provider';


type Step = 'credentials' | 'candidateInfo';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends FormProvider implements OnInit {

  private currentStepSubject: BehaviorSubject<Step> = new BehaviorSubject<Step>('credentials');
  currentStep$: Observable<Step> = this.currentStepSubject.asObservable();

  registerForm: FormGroup = new FormGroup({});

  registerSteps: Route[] = [];
  currentStep: string;

  constructor(
    private logger: NGXLogger,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    super();

    // Populate the list of steps
    this.registerSteps = this.router.config.find(route => route.path === 'register')?.children?.filter(route => route.path != '') || [];
    this.currentStep = this.router.routerState.snapshot.url.split('/').slice(-1)[0];

    this.logger.debug(`RegisterComponent`, this.router, this.route, this.router.config.find(route => route.path === 'register')?.children);

    //
    // On first-time initialization create a blank Reactive Form
    //
    this.logger.debug(`<init>: Creating registerForm...`)
    this.registerForm = this.fb.group({
      credentials: this.fb.group({
        email: ['', [Validators.required]],
        password: ['', [Validators.required]],
        verify: ['', [Validators.required]],
        visited: [true, []]
      }),
      candidateInfo: this.fb.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        beltrank: ['', [Validators.required]],
        poom: [false, []],
        visited: [true, []],
      }),
      recaptcha: [null, []],
      confirm: [false, [Validators.requiredTrue]]
    });
  }

  public subformInitialized(step: Step, formGroup: FormGroup) {
    this.registerForm.setControl(step, formGroup);
  }

  public changeStep(currentStep: string, direction: 'forward' | 'back') {
    switch(currentStep) {
      case 'credentials':
        this.currentStepSubject.next(direction === 'forward' ? 'candidateInfo' : currentStep);
        break;
      case 'candidateInfo':
        this.currentStepSubject.next(direction === 'forward' ? currentStep : 'credentials');
        break;
    }
  }

  getForm(): FormGroup {
    return this.registerForm;
  }

  hasVisited(stepName?: string): boolean {

    return stepName ? stepName === this.currentStep || this.registerForm.get(stepName)?.get('visited')?.value as boolean : false;
  }

  lastVisited() {
    return this.stepNames[Object.values(this.registerForm.value).filter(value => value instanceof AbstractControl && value.get('visited')?.value === true).length];
  }

  get stepNames(): string[] {
    return this.registerSteps.map(route => route.path || '');
  }

  prevStep(stepName?: string): string | undefined{
    const stepIndex = this.stepNames.findIndex(key => key === (stepName || this.currentStep));

    return stepIndex > 0 ? this.stepNames[stepIndex - 1] : undefined;
  }

  nextStep(stepName?: string): string | undefined {
    const stepIndex = this.stepNames.findIndex(key => key === this.currentStep);

    return stepIndex < this.stepNames.length - 1 ? this.stepNames[stepIndex + 1] : undefined;
  }

  isActive(stepName?: string): boolean {
    return stepName ? stepName === this.currentStep : false;
  }

  public onBack() {
    this.logger.debug('onBack', this.prevStep());
    this.router.navigate([`/register/${this.prevStep()}`]);
  }

  public onNext() {
    this.logger.debug('onNext', this.prevStep());
    this.router.navigate([`/register/${this.nextStep()}`]);
  }

  public onSubmit() {

  }

  public ngOnInit(): void {
    this.registerForm = this.fb.group({
      credentials: null,
      candidateInfo: null,
    });
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import firebase from 'firebase/compat/app';
import { FirebaseError } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { NGXLogger } from 'ngx-logger';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { PersonNameComponents } from '@core/person-name-components';
import { StorageService } from '@core/services/storage.service';
import { Candidate } from '@core/interfaces/candidate';
import { Cycle } from '@core/interfaces/cycle';
import { CyclesService } from '@core/services/cycles.service';
import { firstValueFrom, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FormProvider } from '@features/form-provider';
import { RegisterComponent } from '../register.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register-credentials',
  templateUrl: './register-credentials.component.html',
  styleUrls: ['./register-credentials.component.scss'],
  providers: [{ provide: FormProvider, useExisting: RegisterComponent }]
})
export class RegisterCredentialsComponent implements OnInit {

  currentUser: firebase.User | null = null;
  currentGroups: string[] = [];

  currentCycle: Cycle | null = null;
  currentCandidate: Candidate | null = null;
  
  @Input() 
  startingForm: FormGroup = new FormGroup({});

  @Output() 
  subformInitialized: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  @Output() 
  changeStep: EventEmitter<boolean> = new EventEmitter<boolean>();

  registerForm: FormGroup = new FormGroup({});

  constructor(
    private formProvider: FormProvider,
    private logger: NGXLogger,
    private router: Router,
    private fb: FormBuilder,
    private firebaseAuth: AngularFireAuth,
    private storageService: StorageService,
    private cyclesService: CyclesService
  ) {
    // Get the shared mult-step form from the RegisterComponent
    this.registerForm = this.formProvider.getForm();

    this.registerForm.get('credentials')?.get('visited')?.setValue(true);

    // Load the current cycle and candidate
    this.cyclesService.getCurrentCycle()
      .pipe(
        tap(cycle => {
          this.logger.debug(`<init>: UPDATING currentCycle`, cycle);
          this.currentCycle = cycle
        }),
      ).subscribe();

    //
    // Update the currentUser/currentGroups whenever there is a sign-in or sign-out
    //
    this.firebaseAuth.onAuthStateChanged(firebaseUser => {
      this.logger.debug(`<init>: User has signed ${firebaseUser ? 'in' : 'out'}.`, firebaseUser);
      this.logger.debug(`<init>: UPDATING current user`, firebaseUser);
      this.currentUser = firebaseUser;

      // If the user has signed in, update the Reactive Form with the user details...
      if (firebaseUser != null) {
        firebaseUser?.getIdTokenResult()
          .then((idTokenResult) => {
            this.logger.debug(`<init>: User claims`, idTokenResult.claims);
            this.currentGroups = idTokenResult.claims['groups'] || [];
          });

        // Reset the credentials FormGroup so it can no longer be updated
        this.f('credentials')?.reset();
        this.f('credentials')?.disable();
        this.f('credentials')?.markAllAsTouched();
        this.f('credentials.email')?.setValue(firebaseUser.email);

        // Navigate to candidate-info step...
        this.f('credentials.visited')?.setValue(true)
        this.router.navigate(['/register/candidate-info']);
      } else {
        this.storageService.setItem('current_candidate', null);
        this.f('credentials')?.reset();
        this.f('credentials')?.enable();
      }
    });
  }

  onNext() {

  }

  onBack() {

  }

  onCancel() {

  }

  f(path: string | readonly (string | number)[]): AbstractControl | null {
    return this.registerForm?.get(path) || null;
  }

  public async handleEmailCreate(email: string, password: string) {
    this.logger.debug(`handleEmailCreate...`, email, password);
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      this.logger.debug(`handleEmailSignIn: Returned UserCredential and User`, userCredential, userCredential.user);
    } catch(error) {
      if (error instanceof FirebaseError) {
        if (error.code.includes('auth/')) {
          this.f('credentials.email')?.setErrors({'verify': error.code});
          this.f('credentials.password')?.reset();
          this.f('credentials.password')?.setErrors({'verify': error.code});
          this.f('credentials.verify')?.reset();
          this.f('credentials.verify')?.setErrors({'verify': error.code});
          this.logger.debug(`Firebase error: ${error.code}, ${error.message}`, error);
        } else {
          this.logger.error(`Unhandled Firebase error: ${error.code}, ${error.message}`, error);
        }
      } else {
        this.logger.error(`Unknown error!`, error);
      }
    }
  }

  public async handleEmailSignIn(email: string, password: string) {
    this.logger.debug(`handleEmailSignIn...`, email, password);

    try {
      const userCredential = await signInWithEmailAndPassword(getAuth(), email, password);
      this.logger.debug(`handleEmailSignIn: Returned UserCredential and User`, userCredential, userCredential.user);
    } catch(error) {
      if (error instanceof FirebaseError) {
        if (error.code.includes('auth/')) {
          this.f('credentials.email')?.setErrors({'verify': error.code});
          this.f('credentials.password')?.reset();
          this.f('credentials.password')?.setErrors({'verify': error.code});
          this.f('credentials.verify')?.reset();
          this.f('credentials.verify')?.setErrors({'verify': error.code});
          this.logger.debug(`Firebase error: ${error.code}, ${error.message}`, error);
        } else {
          this.logger.error(`Unhandled Firebase error: ${error.code}, ${error.message}`, error);
        }
      } else {
        this.logger.error(`Unknown error!`, error);
      }
    }
  }

  public async handleAppleSignIn() {
  }

  public async handleGoogleSignIn() {
    this.logger.debug(`handleGoogleSignIn...`)
    const auth = getAuth();
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const oauthCredential = GoogleAuthProvider.credentialFromResult(userCredential);
      this.logger.debug(`handleGoogleSignIn: Returned OAuthCredential and User`, oauthCredential, userCredential.user);
    } catch(error) {
      if (error instanceof FirebaseError) {
        this.logger.error(`handleGoogleSignIn: Login Failed!`, error.code, error.message);
        const oauthCredential = GoogleAuthProvider.credentialFromError(error);
        this.logger.debug(`handleGoogleSignIn: Returned OAuthCredential and User`, oauthCredential, '-?-');
      }
    }
  }

  /**
   * 
   */
  public ngOnInit(): void {
    this.logger.debug(`ngOnInit`, this.currentUser, this.currentGroups, this.currentCycle, this.currentCandidate);
    if (this.currentCandidate != null) {
      this.logger.warn(`Oh no! We already have a current candidate!`, this.currentCandidate, this.currentUser?.uid);
      //window.alert(`Oh no, you are already registered for ${this.currentCycle?.title}, ${this.currentCandidate.givenName}! (${this.currentCandidate.userId})`);
    }
  } 

  private async getCurrentCycle(): Promise<Cycle | null>  {
    try {
      return await firstValueFrom(this.cyclesService.getCurrentCycle());
    } catch(error) {
      if (error instanceof HttpErrorResponse && error.status == 404) {
        return Promise.resolve(null);
      }
      throw error;
    }
  }
}

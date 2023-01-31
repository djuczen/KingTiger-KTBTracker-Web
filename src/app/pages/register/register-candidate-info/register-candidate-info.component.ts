import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import firebase from 'firebase/compat/app';

import { Candidate } from '@core/interfaces/candidate';
import { Cycle } from '@core/interfaces/cycle';
import { PersonNameComponents } from '@core/person-name-components';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { StorageService } from '@core/services/storage.service';
import { NGXLogger } from 'ngx-logger';
import { CyclesService } from '@core/services/cycles.service';
import { firstValueFrom, tap } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PhysicalExam } from '@core/interfaces/physical-exam';
import { UsersService } from '@core/services/users.service';
import { CandidatesService } from '@core/services/candidates.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoDialogComponent } from '@shared/info-dialog/info-dialog.component';
import { FormProvider } from '@features/form-provider';
import { RegisterComponent } from '../register.component';


@Component({
  selector: 'app-register-candidate-info',
  templateUrl: './register-candidate-info.component.html',
  styleUrls: ['./register-candidate-info.component.scss'],
  providers: [{ provide: FormProvider, useExisting: RegisterComponent }]
})
export class RegisterCandidateInfoComponent implements OnInit {

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
    private cyclesService: CyclesService,
    private candidatesService: CandidatesService,
    private usersService: UsersService,
    private modalService: NgbModal
  ) {
    // Get the shared mult-step form from the RegisterComponent
    this.registerForm = this.formProvider.getForm();

    // Load the current cycle and candidate
    this.getCurrentCycle();

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

        this.registerForm.reset();
        this.registerForm.disable();
        this.f('email')?.setValue(firebaseUser.email);

        const components = new PersonNameComponents(firebaseUser.displayName || '');
        this.f('firstName')?.setValue(this.f('firstName')?.value ? this.f('firstName')?.value : components.givenName);
        this.f('lastName')?.setValue(this.f('lastName')?.value ? this.f('lastName')?.value : components.familyName);

        //this.getCurrentCandidate();
      } else {
        this.storageService.setItem('current_candidate', null);
        this.registerForm.reset();
        this.registerForm.enable();
      }
    });
  }

  f(path: string | readonly (string | number)[]): AbstractControl | null {
    return this.registerForm.get(path);
  }
  
  public async onSubmit() {
    try {
      //
      // Ensure that the user exists in our database
      //
      try {
        await firstValueFrom(this.usersService.getUser(this.currentUser?.uid || ''));
        this.logger.debug(`Yay! User '${this.currentUser?.uid}' already exists!`)
      } catch(error) {
        if (error instanceof HttpErrorResponse && error.status == 404) {
          this.logger.debug(`Oh dear, creating missing user '${this.currentUser?.uid}'...`);
          await firstValueFrom(this.usersService.createUser({
            userId: this.currentUser?.uid || '', 
            email: this.currentUser?.email || '', 
            displayName: this.currentUser?.displayName || '',
          }));
        } else {
          throw error;
        }
      }
    } catch (error) {
      this.logger.error(`Unhandled error!!!`, error);
    }
  
    //
    // The user is signed-in and is defined to the database. 
    // Now check that the candidate does not already exist and then create the candidate.
    //
    try {
      this.logger.debug(`LOADING currentCycle/currentCandidate...`);
      this.currentCycle = await firstValueFrom(this.cyclesService.getCurrentCycle());
      this.currentCandidate = await firstValueFrom(this.candidatesService.getCurrentCandidate(this.currentCycle));
      this.logger.debug(`Well, this is embarassing... candidate already exists!`, this.currentCandidate);
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status == 404) {
        this.logger.debug(`Oh! Candidate does not exist, creating...`);
        const candidate: Candidate = {
          id: 0,
          userId: this.currentUser?.uid || '',
          cycleId: this.currentCycle?.id || 0,
          status: 0,
          hidden: false,
          audit: false,
          cycleCont: 0,
          poom: this.f('poom')?.value,
          beltRank: this.f('beltRank')?.value,
          essays: 0,
          letters: 0,
          preExamWritten: 0.0,
          examWritten: 0.0,
          physicalExam: new PhysicalExam(),
          displayName: [this.f('firstName')?.value, this.f('lastName')?.value].join(' '),
        }
  
        this.currentCandidate = await firstValueFrom(this.candidatesService.createCandidate(candidate));
        this.logger.debug(`Candidate created!`, this.currentCandidate);
      }
    }
  
    //
    // Registration complete, navigate to Dashboard...
    //
    this.logger.debug(`< onSubmit()`);
    this.router.navigate(['register']);  
  }

  public onCancel() {

  }

  public onBack() {

  }

  public ngOnInit(): void {
    this.getCurrentCandidate();

    if (this.currentCandidate) {
      const components = new PersonNameComponents(this.currentCandidate.displayName);

      this.f('candidateInfo')?.reset();
      this.f('candidateInfo.firstName')?.setValue(components.givenName);
      this.f('candidateInfo.lastName')?.setValue(components.familyName);

      this.f('candidateInfo.beltRank')?.setValue(this.currentCandidate.beltRank);
      this.f('candidateInfo.poom')?.setValue(this.currentCandidate.poom);

      const modalRef = this.modalService.open(InfoDialogComponent, { centered: true, scrollable: true });
      modalRef.componentInstance.title = 'Already Registered';
      modalRef.componentInstance.message = `You have already registered for ${this.currentCycle?.title}. If you have not yet been activate please contact one of the cycle administrators.`
  
      modalRef.result.then((action) => {
        this.logger.debug(`Dialog closed ${action}`);
        this.router.navigate(['/']);
      });
    } else {
      const components = new PersonNameComponents(this.currentUser?.displayName || '');

      this.f('candidateInfo')?.reset();
      this.f('candidateInfo.firstName')?.setValue(components.givenName);
      this.f('candidateInfo.lastName')?.setValue(components.familyName);

    }
  } 

  /**
   * Get the current cycle (or null) and assign it to currentCycle.
   */
  private async getCurrentCycle(): Promise<void> {
    try {
      this.currentCycle = await firstValueFrom(this.cyclesService.getCurrentCycle());
      this.logger.debug(`getCurrentCycle: UPDATED currentCycle`, this.currentCycle);
    } catch(error) {
      if (error instanceof HttpErrorResponse && error.status == 404) {
        this.currentCycle = null;
        this.logger.debug(`Sorry, no current cycle!`);
      }
    }
  }

  private async getCurrentCandidate(cycle?: Cycle): Promise<void> {
    try {
      this.currentCandidate = await firstValueFrom(this.candidatesService.getCurrentCandidate(cycle));
      this.logger.debug(`getCurrentCandidate: UPDATED currentCandidate`, this.currentCandidate);
      this.f('beltRank')?.setValue(this.currentCandidate.beltRank);
      this.f('poom')?.setValue(this.currentCandidate.poom);
  
      const modalRef = this.modalService.open(InfoDialogComponent, { centered: true, scrollable: true });
      modalRef.componentInstance.title = 'Already Registered';
      modalRef.componentInstance.message = `You have already registered for ${this.currentCycle?.title}. If you have not yet been activated please contact one of the cycle administrators.`
  
      modalRef.result.then((action) => {
        this.logger.debug(`Dialog closed ${action}`);
        this.router.navigate(['/']);
      });
      
  
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status == 404) {
        this.logger.debug(`No candidate!`);
      }
    }
  }
}

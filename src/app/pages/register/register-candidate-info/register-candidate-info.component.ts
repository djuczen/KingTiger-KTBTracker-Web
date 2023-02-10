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
import { CycleCandidateComponent } from '@core/classes/cycle-candidate-component';


@Component({
  selector: 'app-register-candidate-info',
  templateUrl: './register-candidate-info.component.html',
  styleUrls: ['./register-candidate-info.component.scss'],
})
export class RegisterCandidateInfoComponent extends CycleCandidateComponent implements OnInit {

  registerForm: FormGroup = new FormGroup({});

  constructor(
    logger: NGXLogger,
    firebaseAuth: AngularFireAuth,
    cyclesService: CyclesService,
    candidatesService: CandidatesService,
    private router: Router,
    private fb: FormBuilder,
    private storageService: StorageService,
    private usersService: UsersService,
    private modalService: NgbModal
  ) {
    super(logger, firebaseAuth, cyclesService, candidatesService);

    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      beltrank: ['', [Validators.required]],
      poom: [false, []],
      visited: [true, []],
      recaptcha: [null, []],
      confirm: [false, [Validators.requiredTrue]]
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
    // Listen for the user sign in (currentUser) and update the form accordingly...
    this.firebaseAuth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        if (this.currentCandidate) {
          const components = new PersonNameComponents(this.currentCandidate.displayName);

          this.registerForm.reset();
          if (components.givenName) {
            this.f('firstName')?.setValue(components.givenName);
            this.f('firstName')?.markAsDirty();
          }
          if (components.familyName) {
            this.f('lastName')?.setValue(components.familyName);
            this.f('lastName')?.markAsDirty();
          }

          this.f('beltRank')?.setValue(this.currentCandidate.beltRank);
          this.f('poom')?.setValue(this.currentCandidate.poom);

          const modalRef = this.modalService.open(InfoDialogComponent, { centered: true, scrollable: true });
          modalRef.componentInstance.title = 'Already Registered';
          modalRef.componentInstance.message = `You have already registered for ${this.currentCycle?.title}. If you have not yet been activate please contact one of the cycle administrators.`
      
          modalRef.result.then((action) => {
            this.logger.debug(`Dialog closed ${action}`);
            this.router.navigate(['/']);
          });
        } else {
          const components = new PersonNameComponents(firebaseUser.displayName || '');

          this.registerForm.reset();
          if (components.givenName) {
            this.f('firstName')?.setValue(components.givenName);
            this.f('firstName')?.markAsDirty();
          }
          if (components.familyName) {
            this.f('lastName')?.setValue(components.familyName);
            this.f('lastName')?.markAsDirty();
          }

        }
      } 
    }); 
  }
}

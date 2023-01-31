import { HttpErrorResponse } from "@angular/common/http";
import { Candidate } from "@core/interfaces/candidate";
import { Cycle } from "@core/interfaces/cycle";
import { CandidatesService } from "@core/services/candidates.service";
import { CyclesService } from "@core/services/cycles.service";
import { NGXLogger } from "ngx-logger";
import { firstValueFrom } from "rxjs";
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AbstractControl, FormGroup } from "@angular/forms";
import { LocalDate } from "@js-joda/core";
import { CycleWeek } from "@core/interfaces/cycle-week";
import { RequirementConfig, RequirementsConfiguration } from "@core/config/requirements.config";
import { Utils } from "@core/utils";


export class CycleCandidateComponent {

    private _currentUser: firebase.User | null = null;
    get currentUser(): firebase.User | null {
        return this._currentUser;
    }
    set currentUser(value: firebase.User | null) {
        this.logger.debug(`CycleCandidateComponent::set currentUser`, value);
        this._currentUser = value;
    }

    private _currentGroups: string[] = [];
    get currentGroups(): string[] {
        return this._currentGroups;
    }
    set currentGroups(value: string[]) {
        this.logger.debug(`CycleCandidateComponent::set currentGroups`, value);
        this._currentGroups = value;
    }

    private _currentCycle: Cycle | null = null;
    get currentCycle(): Cycle | null {
      return this._currentCycle;
    }
    set currentCycle(value: Cycle | null) {
      this.logger.debug(`CycleCandidateComponent::set currentCycle`, value);
      this._currentCycle = value;
    } 
  
    private _currentCandidate: Candidate | null = null;
    get currentCandidate(): Candidate | null {
      return this._currentCandidate;
    }
    set currentCandidate(value: Candidate | null) {
      this.logger.debug(`CycleCandidateComponent::set currentCandidate`, value);
      this._currentCandidate = value;
    }
    
    constructor(
        protected logger: NGXLogger,
        protected firebaseAuth: AngularFireAuth,
        protected cyclesService: CyclesService,
        protected candidatesService: CandidatesService
    ) {
        // Fetch the current cycle and cadidate if possible
        this.fetchCurrentCycleAndCandidate();

        //
        // Update the currentUser/currentGroups whenever there is a sign-in or sign-out
        //
        this.firebaseAuth.onAuthStateChanged(firebaseUser => {
            this.logger.debug(`CycleCandidateComponent::init: User has signed ${firebaseUser ? 'in' : 'out'}.`, firebaseUser);
            this.currentUser = firebaseUser;
    
            // If the user has signed in, update the Reactive Form with the user details...
            if (firebaseUser != null) {
            firebaseUser?.getIdTokenResult()
                .then((idTokenResult) => {
                    this.logger.debug(`CycleCandidateComponent::init: User claims`, idTokenResult.claims);
                    this.currentGroups = idTokenResult.claims['groups'] || [];
                });
            }
        });
    }

    protected range(size: number, startAt: number = 0): number[] {
        return Utils.range(size, startAt);
    }
    
    protected getConfig(name: string): RequirementConfig | undefined {
        return RequirementsConfiguration.all.get(name);
    }
    
    protected inRole(role: string): boolean {
        return this.currentGroups?.includes(role) || false;
    }

    protected formDate(formGroup: AbstractControl): LocalDate {
        return formGroup.get('date')?.getRawValue() as LocalDate;
    }

    protected editable(formGroup: AbstractControl, index: number) {
        // Allow editing of this group
        formGroup.enable();
        // Never enable journals!
        formGroup.get('journals')?.disable();
    }

    protected isEditable(formGroup: AbstractControl): boolean {
        return formGroup.get('date')?.disabled === true || false;
    }

    /**
     * Determine if tracking records can be edited.
     * 
     * Tracking records can be edited if the records are owned by the current user or the current user is an administrator.
     * 
     * @param group the reactive FormGroup being checked
     * @returns 
     */
    protected canEdit(formGroup: AbstractControl): boolean {
        if (!this.currentGroups.includes('admin')) {
            if (this.currentCandidate?.userId === this.currentUser?.uid) {
                // If the current user is the current candidate they can edit tracking data on a sliding week only!
                if (formGroup instanceof FormGroup && this.formDate(formGroup)) {
                    const trackingDate = this.formDate(formGroup);

                    return (trackingDate.isBefore(LocalDate.now().minusDays(3)) || trackingDate.isAfter(LocalDate.now().plusDays(3))) ? false : true;
                }
                // For non-tracking data, the current user "owns" the data, so they can edit it
                return true;
            }


        // Otherwise... do NOT allow editing!
        return this.currentCandidate?.userId === this.currentUser?.uid;
        }

        // Administrators can ALWAYS edit!
        return true;
    }

    canEditTitle(formGroup: AbstractControl): string {
        if (!this.currentGroups.includes('admin')) {
            if (this.currentCandidate?.userId === this.currentUser?.uid) {
                return !this.canEdit(formGroup) ? 'Candidates can only edit the current week. Please contact an adminstrator.' : '';
            }

            return 'Candidates can only edit their own tracking numbers.';
        }

        return '';
    }


    protected async fetchCurrentCycleAndCandidate(): Promise<void> {
        this.currentCycle = await this.getCurrentCycle();
        this.currentCandidate = await this.getCurrentCandidate(this.currentCycle);
    }

    protected async getCurrentCycle(): Promise<Cycle | null> {
        return this.getCycle('current');
    }

    protected async getCycle(cycleId?: number | 'current'): Promise<Cycle | null> {
        try {
            return await firstValueFrom(this.cyclesService.getCycle(cycleId));
        } catch(error) {
            if (error instanceof HttpErrorResponse && error.status == 404) {
                return Promise.resolve(null);
            }
            throw error;
        }
   }

    protected async getCurrentCandidate(cycle?: Cycle | null) {
        try {
            return await firstValueFrom(this.candidatesService.getCurrentCandidate(cycle));
        } catch(error) {
            if (error instanceof HttpErrorResponse && error.status == 404) {
                return Promise.resolve(null);
            }
            throw error;
        }
    }

    protected async getCandidate(candidateId?: number) {
        try {
            return await firstValueFrom(this.candidatesService.getCandidate(candidateId));
        } catch(error) {
            if (error instanceof HttpErrorResponse && error.status == 404) {
                return Promise.resolve(null);
            }
            throw error;
        }
    }
}

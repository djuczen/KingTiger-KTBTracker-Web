import { HttpErrorResponse } from '@angular/common/http';
import { makeBindingParser } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { combineLatest, firstValueFrom } from 'rxjs';
import firebase from 'firebase/compat/app';
import { NGXLogger } from 'ngx-logger';
import * as  _ from 'underscore';

import { replacer } from '@core/interceptors/json.interceptor';

import { Cycle } from '@core/interfaces/cycle';
import { CyclesService } from '@core/services/cycles.service';
import '@js-joda/timezone';
import { ChronoUnit, LocalDate, DateTimeFormatter } from '@js-joda/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormBuilder, AbstractControl, FormArray } from '@angular/forms';
import { ParamMap, ActivatedRoute, UrlSegment } from '@angular/router';
import { Candidate } from '@core/interfaces/candidate';
import { CandidateTracking } from '@core/interfaces/candidate-tracking';
import { FullStatistics } from '@core/interfaces/full-statistics';
import { CandidatesService } from '@core/services/candidates.service';
import { TrackingService } from '@core/services/tracking.service';

import { Tracking } from '@core/interfaces/tracking';
import { Utils } from '@core/utils';
import { PersonNameComponents } from '@core/person-name-components';
import { RequirementConfig, RequirementsConfiguration } from '@core/config/requirements.config';
import { CycleCandidateComponent } from '@core/classes/cycle-candidate-component';
import { CycleWeek } from '@core/interfaces/cycle-week';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends CycleCandidateComponent implements OnInit {


  requirementsForm: FormGroup = new FormGroup({});

  paramsMap: ParamMap | undefined;

  currentWeek: CycleWeek = new CycleWeek();

  currentStatistics: FullStatistics | undefined;

  physicalStatistics: FullStatistics | undefined;
  classesStatistics: FullStatistics | undefined;

  candidateTracking: CandidateTracking | undefined;
  
  constructor(
    logger: NGXLogger,
    fireAuth: AngularFireAuth,
    cyclesService: CyclesService,
    candidatesService: CandidatesService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private trackingService: TrackingService,
  ) { 
    super(logger, fireAuth, cyclesService, candidatesService);
    this.logger.debug(`DashboardComponent::init...`);
    // Load the current cycle (or null)
    this.getCurrentCycle();

    this.logger.debug(`DashboardComponent::init`);
  }
  

  //
  // "Current" Values
  //

  get currentRoute(): UrlSegment[] {
    return this.route.snapshot.url;
  }

  get currentDate(): LocalDate {
    return LocalDate.now();
  }


  weekColor(week: number): string {
    if (week >= 0 && week < (this.currentCycle?.cycleWeeks || 0)) {
      if (this.currentStatistics && this.currentStatistics.weekly && this.currentStatistics.weekly.length >= week) {
        const overall = this.currentStatistics?.weekly[week].overall || 0;
        return overall > 0 ? Utils.percentAsColor(this.currentStatistics?.weekly[week].overall || 0) : 'white';
      }
    }
    return 'white';
  }

  weekProgress(): number {
    return this.currentCycle ? (this.currentStatistics?.weekly[this.currentCycle.currentWeek].overall || 0)  * 100.0 : 0;
  }

  weekPhysical(): number {
    return this.currentCycle ? (this.physicalStatistics?.weekly[this.currentCycle.currentWeek].overall || 0)  * 100.0 : 0;
  }

  weekClasses(): number {
    return this.currentCycle ? (this.classesStatistics?.weekly[this.currentCycle.currentWeek].overall || 0)  * 100.0 : 0;
  }

  weeklyProgress(formArray: FormArray, controlName: string) {
    let controlProgress = 0;
    for (let control of formArray.controls) {
      controlProgress += parseFloat(control.get(controlName)?.getRawValue() || 0);
    }
    return this.weeklyGoal(controlName) > 0 ? (controlProgress / this.weeklyGoal(controlName)) * 100.0 : 0;
  }

  weeklyGoal(name: string): number {
    if (this.currentCycle === undefined) {
      return 0;
    }

    const cycleTarget = _.get(this.currentCycle?.requirements || {}, name, 0) as number;
    return cycleTarget > 0 ? cycleTarget * (7 / (this.currentCycle?.cycleDays || 1)) : 0;
  }

  //
  // Cycle Related Values
  //

  cycleProgress(): number {
    return (this.currentStatistics?.cycle.overall || 0)  * 100.0;
  }
 

  //
  // Form Processing...
  //

  get weeklyA(): FormArray {
    return this.requirementsForm.controls['weeklyA'] as FormArray;
  }
  
  f(control: AbstractControl, name: string): any {
    return control.get(name)?.getRawValue();
  }


  onSubmit(): void {
    this.logger.debug(`onSubmit(...)`);
  }

  edit(group: AbstractControl, index: number) {
    // Allow editing of this group
    group.enable();
    // Never enable journals!
    group.get('journals')?.disable();
  }

  save(group: AbstractControl, index: number) {
    this.logger.debug(`[ENTRY] save`, this.candidateTracking?.daily[index].trackingDate, group, index);
    group.updateValueAndValidity();

    
    const trackingRequest: Tracking | undefined = this.candidateTracking?.daily[index] as Tracking;

    trackingRequest.requirements =  _.defaults(_.mapObject(_.omit(group.value, ['date']), 
      (v, k) => v === 'true' || v === true ? 1 : v === 'false' || v === false ? 0 : v), 
      this.candidateTracking?.daily[index].requirements);
      
    this.updateCandidateTracking(this.currentCandidate, trackingRequest);

    // Disallow editing of this group
    group.disable();
  }

  cancel(group: AbstractControl, index: number) {
    // Disallow editing of this group
    group.reset();
    group.disable();
  }
  
  //
  // Data Access
  //

  async fetchCycleAndCandidate(cycleId?: number | string) {
    this.logger.debug(`fetchCycle(...)`, cycleId);
    const forCycle = cycleId !== undefined ? cycleId : this.paramsMap?.get('cycle') || 'current';
    this.currentCycle = await this.getCurrentCycle();
    this.currentCandidate = await this.getCurrentCandidate(this.currentCycle);
  }

  async fetchCandidate(candidateId?: number | string) {
    this.logger.debug(`fetchCandidate(...)`, candidateId);
    const forCandidate = candidateId !== undefined ? candidateId : this.paramsMap?.get('can_id') || 'me';
    if (forCandidate === 'me') {
      this.candidatesService.getCurrentCandidate(this.currentCycle)
        .subscribe({
          next: (candidate) => {
            this.currentCandidate = candidate;

            // The candidate may have changed or is new, (re-)fetch the tracking data now
            this.fetchCandidateTracking(this.currentCandidate, this.currentCycle?.weekStarts || LocalDate.now(), this.currentCycle?.weekEnds || LocalDate.now());
          }
        })
    } else {
      this.candidatesService.getCandidate(forCandidate)
        .subscribe({
          next: (candidate) => {
            this.currentCandidate = candidate;

            // If the cycle hasn't already been fetched or has changed, fetch it now
            if (this.currentCycle === undefined || this.currentCycle?.id !== candidate.cycleId) {
              this.fetchCurrentCycleAndCandidate();
            }

            // The candidate may have changed or is new, (re-)fetch the tracking data now
            this.fetchCandidateTracking(this.currentCandidate, this.currentCycle?.weekStarts || LocalDate.now(), this.currentCycle?.weekEnds || LocalDate.now());
          }
        });
    }
  }

  fetchCandidateTracking(candidate: Candidate | null, startDate: LocalDate, endDate: LocalDate) {
    this.logger.debug(`fetchCandidateTracking(...)`, candidate, startDate, endDate);
    this.trackingService.getCandidateTracking(candidate, startDate, endDate)
      .subscribe({
        next: (candidateTracking) => {
          this.candidateTracking = candidateTracking;

          // For each tracking date...
          //this.requirementsForm = this.fb.group({
          //  weeklyA: this.fb.array(this.formArrayInitializer(WEEKLY_GOALS_A, candidateTracking.daily)),
          //});

          this.fetchCandidateStatistics(this.currentCandidate);
        },
        error: (error) => {

        }
      });
  }

  fetchCandidateStatistics(candidate: Candidate | null) {
    combineLatest([
      this.trackingService.getCandidateStatistics(candidate, 'all'), 
      this.trackingService.getCandidateStatistics(candidate, 'physical'), 
      this.trackingService.getCandidateStatistics(candidate, 'classes')]).subscribe(([allStats, physicalStats, classesStats]) => {
        this.currentStatistics = allStats;
        this.physicalStatistics = physicalStats;
        this.classesStatistics = classesStats;
      });
  }

  updateCandidateTracking(candidate: Candidate | null, tracking: Tracking) {
    this.trackingService.updateCandidateTracking(candidate, tracking)
      .subscribe({
        next: (result) => {
          // Re-fetch the tracking date to reflect any updates
          this.fetchCandidateTracking(candidate, this.currentCycle?.weekStarts || LocalDate.now(), this.currentCycle?.weekEnds || LocalDate.now());
        }
      });
  }


  public ngOnInit(): void {
    this.logger.debug(`DashboardComponent::ngOnInit...`);
    combineLatest([this.route.queryParamMap]).subscribe({
      next: ([paramsMap]) => {
        this.paramsMap = paramsMap;
        this.currentWeek = this.currentCycle?.weekDaysOf(paramsMap.get('week')) || new CycleWeek();

        // We have our query parameters and our user... load the cycle and tracking data
        this.fetchCycleAndCandidate();
      }
    });
  }


  private formArrayInitializer(fields: string[], tracking?: Tracking[] | undefined): FormGroup[] {
    let formArrayGroups: FormGroup[] = [];

    if (tracking === undefined) {
      this.currentCycle?.weekDaysOf().days.forEach((weekDay, day) => {
        const formArrayGroup = new Map();
        formArrayGroup.set('date', weekDay);
        fields.forEach((fieldName) => {
          //console.debug(`[DEBUG] ${weekDay} (${day}) ${fieldName}: new FormControl(\'\')`);
          formArrayGroup.set(fieldName, this.fb.control('', []));
        });
        formArrayGroups.push(this.fb.group(Object.fromEntries(formArrayGroup)));
        formArrayGroups.at(-1)?.disable();
      });
    } else {
      tracking.forEach((daily, day) => {
        const formArrayGroup = new Map();
        formArrayGroup.set('date', daily.trackingDate);
        new Map(Object.entries(daily.requirements)).forEach((value, fieldName) => {
          if (fields.includes(fieldName)) {
            //console.debug(`[DEBUG] ${daily.trackingDate} ${fieldName}: new FormControl(${value})`, requirementsConfig.get(fieldName)?.validators);
            formArrayGroup.set(fieldName, this.fb.nonNullable.control(value, RequirementsConfiguration.all.get(fieldName)?.validators));
          }
        });
        //console.debug(`[DEBUG] FormGroup`, formArrayGroup);
        formArrayGroups.push(this.fb.group(Object.fromEntries(formArrayGroup)));
        formArrayGroups.at(-1)?.disable();
      });
    }
    return formArrayGroups;
  }
}

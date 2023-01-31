import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { replacer } from '@core/interceptors/json.interceptor';
import firebase from 'firebase/compat/app';
import { NGXLogger } from 'ngx-logger';
import * as  _ from 'underscore';

import { Cycle } from '@core/interfaces/cycle';

import { CyclesService } from '@core/services/cycles.service';
import '@js-joda/timezone';
import { Locale } from '@js-joda/locale';
import { LocalDate } from '@js-joda/core';
import { TrackingService } from '@core/services/tracking.service';
import { Tracking } from '@core/interfaces/tracking';
import { CandidatesService } from '@core/services/candidates.service';
import { Candidate } from '@core/interfaces/candidate';
import { CandidateTracking } from '@core/interfaces/candidate-tracking';
import { ActivatedRoute, ParamMap, Route, UrlSegment } from '@angular/router';
import { combineLatest } from 'rxjs';
import { Utils } from '@core/utils';
import { FullStatistics } from '@core/interfaces/full-statistics';
import { StorageService } from '@core/services/storage.service';
import { RequirementConfig, RequirementsConfiguration } from '@core/config/requirements.config';
import { CycleDates } from '@core/cycle-dates';
import { CycleCandidateComponent } from '@core/classes/cycle-candidate-component';
import { CycleWeek } from '@core/interfaces/cycle-week';



const WEEKLY_GOALS_A = ['miles', 'pullUps', 'planks', 'rollsFalls', 'journals'];

const DAILY_GOALS_A = ['jumps', 'pushUps', 'sitUps', 'burpees'];

const DAILY_GOALS_B = ['poomsae', 'selfDefense', 'kicks'];


@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent extends CycleCandidateComponent implements OnInit {

  requirementsForm: FormGroup = new FormGroup({});

  paramsMap: ParamMap | undefined;

  currentWeek: CycleWeek = new CycleWeek();

  currentStatistics: FullStatistics | undefined;

  candidateTracking: CandidateTracking | undefined;

  candidateList: Candidate[] = [];
  candidateStatisticsList: FullStatistics[] = [];

  constructor(
    logger: NGXLogger,
    fireAuth: AngularFireAuth,
    cyclesService: CyclesService,
    candidatesService: CandidatesService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private storageService: StorageService,
    private trackingService: TrackingService,
  ) {
    super(logger, fireAuth, cyclesService, candidatesService);

    this.requirementsForm = this.fb.group({
      weeklyA: this.fb.array(this.formArrayInitializer(WEEKLY_GOALS_A)),
      dailyA: this.fb.array(this.formArrayInitializer(DAILY_GOALS_A)),
      dailyB: this.fb.array(this.formArrayInitializer(DAILY_GOALS_B))
    });
    this.requirementsForm.disable();
  }

  // 
  // "Current" Values
  //

  get currentRoute(): UrlSegment[] {
    return this.route.snapshot.url;
  }

  get currentDate(): LocalDate {
    return LocalDate.now(); //.minusWeeks(4);
  }

  //
  // Week Related Values
  //

  weekDate(index: number): LocalDate {
    return this.currentWeek.days[index];
  }

  weekColor(week: number, index?: number): string {
    if (this.currentCycle) {
      const statistics = (index !== undefined && this.candidateStatisticsList[index]) ? this.candidateStatisticsList[index] : this.currentStatistics;
      if (week >= 0 && week < this.currentCycle?.cycleWeeks) {
        if (statistics && statistics.weekly && statistics.weekly.length >= week) {
          return this.currentCycle ? CycleDates.weekColor(this.currentCycle, statistics.weekly[week].overall || 0) : 'white';
        }
      }
    }
    return 'white';
  }

  weekProgress2(week: number): number {
    return 0;
  }
  weekProgress(): number {
    return (this.currentStatistics?.weekly[this.currentCycle?.weekOf(this.currentWeek) || 0].overall || 0)  * 100.0;
  }

  weeklyProgress(formArray: FormArray, controlName: string) {
    let controlProgress = 0;
    for (let control of formArray.controls) {
      controlProgress += parseFloat(control.get(controlName)?.getRawValue() || 0);
    }
    return this.weeklyGoal(controlName) > 0 ? (controlProgress / this.weeklyGoal(controlName)) * 100.0 : 0;
  }

  weeklyGoal(name: string): number {
    if (this.currentCycle) {
      const cycleTarget = _.get(this.currentCycle.requirements || {}, name, 0) as number;
      return cycleTarget > 0 ? cycleTarget * (7 / this.currentCycle.cycleDays) : 0;
    }
    return 0;
  }

  //
  // Daily Related Values
  //

  dailyProgress(formArray: FormArray, controlName: string) {
    return this.progressOf(formArray, controlName, this.dailyGoal);
  }

  dailyGoal(name: string): number {
    if (this.currentCycle) {
      const cycleTarget = _.get(this.currentCycle.requirements || {}, name, 0) as number;
      return cycleTarget > 0 ? cycleTarget * (1 / this.currentCycle.cycleDays) : 0;
    }
    return 0;
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

  get dailyA(): FormArray {
    return this.requirementsForm.controls['dailyA'] as FormArray;
  }

  get dailyB(): FormArray {
    return this.requirementsForm.controls['dailyB'] as FormArray;
  }


  onSubmit() {
    window.alert('Submitted!');
  }


  f(control: AbstractControl, name: string): any {
    return control.get(name)?.getRawValue();
  }


  edit(group: AbstractControl<any, any>, index: number) {
    // Allow editing of this group
    group.enable();
    // Never enable journals!
    group.get('journals')?.disable();
  }

  save(group: AbstractControl<any, any>, index: number) {
    this.logger.debug(`[ENTRY] save`, this.candidateTracking?.daily[index].trackingDate, group, index);
    group.updateValueAndValidity();

    const trackingRequest: Tracking | undefined = this.candidateTracking?.daily[index] as Tracking;

    trackingRequest.requirements =  _.defaults(_.omit(group.value, ['date']), this.candidateTracking?.daily[index].requirements);
    this.updateCandidateTracking(this.currentCandidate, trackingRequest);

    // Disallow editing of this group
    group.disable();
  }

  cancel(group: AbstractControl<any, any>, index: number) {
    // Disallow editing of this group
    group.reset();
    group.disable();
  }

  //
  // Data Access
  //

  /**
   * 
   * @param cycleId 
   */
  fetchCycle(cycleId?: number | string) {
    this.logger.debug(`fetchCycle(...)`, cycleId, this.paramsMap?.get('cycle'), this.storageService.getItem<Cycle>('activeCycle'));
    this.currentCycle = this.storageService.getItem<Cycle>('activeCycle');
    const forCycle = cycleId || this.paramsMap?.get('cycle') || undefined;

    this.logger.debug('fetchCycle...', this.currentCycle, forCycle, (forCycle ? 'true' : 'false'));
    if (forCycle || this.currentCycle === null) {
      // If we have never fetched a Cycle before, we want the "current" Cycle, or we need a different Cycle, fetch it now
      if (this.currentCycle === null || forCycle === 'current' || (this.currentCycle !== null && (Utils.isInteger(forCycle) && this.currentCycle.id !== forCycle))) {
        this.cyclesService.getCycle(forCycle)
          .subscribe({
            next: (cycle) => {
              this.currentCycle = cycle;
              this.storageService.setItem('activeCycle', cycle);
  
              if (this.inRole('xadmin')) {
                this.fetchCandidates(cycle);
              } else {
                this.fetchCandidate();
              }
            }
          });
      }
    }
  }

  /**
   * 
   */
  fetchCandidate(candidateId?: number | string) {
    this.logger.debug(`fetchCandidate(...)`, candidateId, this.paramsMap?.get('can_id'), this.storageService.getItem<Candidate>('activeCandidate'));
    this.currentCandidate = this.storageService.getItem<Candidate>('activeCandidate');
    const forCandidate = candidateId || this.paramsMap?.get('can_id') || undefined;

    if (forCandidate || this.currentCandidate === null) {
      // If we have never fetched a Candidate before, we want the "me" Candidate, or we need a different Candidate, fetch it now
      if (this.currentCandidate === null || forCandidate === 'me' || (this.currentCandidate !== null && (Utils.isInteger(forCandidate) && this.currentCandidate.id !== forCandidate))) {
        
        if (forCandidate === 'me' || (!forCandidate && this.currentCycle)) {
          this.candidatesService.getCurrentCandidate(this.currentCycle)
            .subscribe({
              next: (candidate) => {
                this.currentCandidate = candidate;
                this.storageService.setItem('activeCandidate', candidate);
  
                // The candidate may have changed or is new, (re-)fetch the tracking data now
                this.fetchCandidateTracking(this.currentCandidate, this.currentWeek.starts, this.currentWeek.ends);
              }
            })
        } else {
          this.candidatesService.getCandidate(forCandidate)
            .subscribe({
              next: (candidate) => {
                this.currentCandidate = candidate;
    
                // If the cycle hasn't already been fetched or has changed, fetch it now
                if (this.currentCycle === undefined || this.currentCycle?.id !== candidate.cycleId) {
                  this.fetchCycle(candidate.cycleId);
                }
    
                // The candidate may have changed or is new, (re-)fetch the tracking data now
                this.fetchCandidateTracking(this.currentCandidate, this.currentWeek.starts, this.currentWeek.ends);
              }
            });
        }
      }
    }
  }
  
  fetchCandidates(cycle?: Cycle | null) {
    this.logger.debug(`fetchCandidates(...)`, cycle);
    this.candidatesService.getCandidates(cycle)
      .subscribe({
        next: (candidates) => {
          this.candidateList = candidates;
          this.logger.debug('candidates', this.candidateList);

          this.candidateStatisticsList = [];
          this.candidateList.forEach((candidate, index) => {
            this.trackingService.getCandidateStatistics(candidate)
              .subscribe({
                next: (statistics) => {
                  this.logger.debug('statistics', candidate, index, statistics);
                  this.candidateStatisticsList[index] = statistics;
                  this.logger.debug('candidateStatisticsList', this.candidateStatisticsList)
                }
              });
          });
          this.logger.debug('candidateStatisticsList', this.candidateStatisticsList);
        }
      });
  }

  fetchCandidateTracking(candidate: Candidate | null, startDate: LocalDate, endDate: LocalDate) {
    this.logger.debug(`fetchCandidateTracking(...)`, candidate, startDate, endDate);
    this.trackingService.getCandidateTracking(candidate, startDate, endDate)
      .subscribe({
        next: (candidateTracking) => {
          this.candidateTracking = candidateTracking;
          // For each tracking date...
          this.requirementsForm = this.fb.group({
            weeklyA: this.fb.array(this.formArrayInitializer(WEEKLY_GOALS_A, candidateTracking.daily)),
            dailyA: this.fb.array(this.formArrayInitializer(DAILY_GOALS_A, candidateTracking.daily)),
            dailyB: this.fb.array(this.formArrayInitializer(DAILY_GOALS_B, candidateTracking.daily)) 
          });

          this.fetchCandidateStatistics(this.currentCandidate);
        },
        error: (error) => {

        }
      });
  }

  fetchCandidateStatistics(candidate: Candidate | null) {
    this.trackingService.getCandidateStatistics(candidate, 'physical')
      .subscribe({
        next: (result) => {
          this.currentStatistics = result;
        }
      });
  }

  updateCandidateTracking(candidate: Candidate | null, tracking: Tracking) {
    this.trackingService.updateCandidateTracking(candidate, tracking)
      .subscribe({
        next: (result) => {
          // Re-fetch the tracking date to reflect any updates
          this.fetchCandidateTracking(candidate, this.currentWeek.starts, this.currentWeek.ends);
        }
      });
  }


  ngOnInit(): void {
    combineLatest([this.route.queryParamMap]).subscribe({
      next: ([paramsMap]) => {
        this.paramsMap = paramsMap;
        this.currentWeek = this.currentCycle?.weekDaysOf(paramsMap.get('week')) || new CycleWeek();

        // We have our query parameters and our user... load the cycle and tracking data
        this.fetchCurrentCycleAndCandidate();
      }
    });
  }

  private formArrayInitializer(fields: string[], tracking?: Tracking[] | undefined): FormGroup[] {
    let formArrayGroups: FormGroup[] = [];

    if (tracking === undefined) {
      this.currentWeek.days.forEach((weekDay, day) => {
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

  progressOf(formArray: FormArray, controlName: string, goalFunction: (name: string) => number): number {
    let controlProgress = 0;
    for (let control of formArray.controls) {
      controlProgress += parseFloat(control.get(controlName)?.getRawValue() || 0);
    }
    return goalFunction(controlName) > 0 ? (controlProgress / goalFunction(controlName)) * 100.0 : 0;
  }
}

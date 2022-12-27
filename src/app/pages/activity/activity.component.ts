import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { replacer } from '@core/interceptors/json.interceptor';
import firebase from 'firebase/compat/app';
import { NGXLogger } from 'ngx-logger';
import * as  _ from 'underscore';

import { Cycle } from '@core/interfaces/cycle';
import { RequirementConfig, Requirements, requirementsConfig } from '@core/interfaces/requirements';
import { CyclesService } from '@core/services/cycles.service';
import '@js-joda/timezone';
import { Locale } from '@js-joda/locale';
import { ChronoUnit, convert, DateTimeFormatter, DayOfWeek, LocalDate, TextStyle } from '@js-joda/core';
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



const WEEKLY_GOALS_A = ['miles', 'pullUps', 'planks', 'rollsFalls', 'journals'];

const DAILY_GOALS_A = ['jumps', 'pushUps', 'sitUps', 'burpees'];

const DAILY_GOALS_B = ['poomsae', 'selfDefense', 'kicks'];


@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  requirementsForm: FormGroup = new FormGroup({});

  paramsMap: ParamMap | undefined;

  currentUser: firebase.User | null | undefined;
  currentGroups: string[] | undefined = [];


  currentCycle: Cycle | null = null;
  currentCandidate: Candidate | null = null;

  currentStatistics: FullStatistics | undefined;

  candidateTracking: CandidateTracking | undefined;

  candidateList: Candidate[] = [];
  candidateStatisticsList: FullStatistics[] = [];

  constructor(
    private logger: NGXLogger,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private storageService: StorageService,
    private cyclesService: CyclesService,
    private candidatesService: CandidatesService,
    private trackingService: TrackingService,
    private fireAuth: AngularFireAuth
  ) { 
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

  /**
   * Returns the zero-based week of the active cycle.
   * 
   * If a week number was provided via query parameters ("week") it used (converted to zero-based), otherwise the week relative
   * to the current date is used.
   */
   get currentWeek(): number {
    //this.logger.debug('currentWeek(...)', this.paramsMap?.get('week'), this.currentCycle, this.currentDate);
    if (this.paramsMap?.get('week') !== null) {
      return Math.min(Math.max(parseInt(this.paramsMap?.get('week') || '1') - 1, 0), this.cycleWeeks);
    } 
    return  Math.min(Math.max(this.currentCycle?.cycleStart.until(this.currentDate.plusDays(1), ChronoUnit.WEEKS) || 0, 0), this.cycleWeeks);
  }

  //
  // Week Related Values
  //

  get weekStarts(): LocalDate {
    //this.logger.debug('weekStarts(...)', this.currentCycle, this.currentWeek, this.currentDate);
    if (this.currentCycle) {
      return this.currentCycle?.cycleStart.plusWeeks(this.currentWeek);
    }
    return this.currentDate.minusDays(this.currentDate.dayOfWeek().value());
  }

  get weekEnds(): LocalDate {
    return this.weekStarts.plusDays(6);
  }

  get weekDays(): LocalDate[] {
    return Array(7).fill(LocalDate.now()).map((value, index) => this.weekStarts.plusDays(index));
  }

  weekDay(index: number): number {
    return this.weekStarts.plusDays(index).dayOfWeek().value();
  }

  weekDate(index: number): LocalDate {
    return this.weekStarts.plusDays(index);
  }

  weekColor(week: number, index?: number): string {
    if (week >= 0 && week < this.cycleWeeks) {
      if (index !== undefined) {
        if (this.candidateStatisticsList[index] && this.candidateStatisticsList[index].weekly && this.candidateStatisticsList[index].weekly.length >= week) {
          const overall = this.candidateStatisticsList[index].weekly[week].overall || 0;
          return overall > 0 ? Utils.percentAsColor(this.candidateStatisticsList[index].weekly[week].overall || 0) : 'black';
        }
      } else {
        if (this.currentStatistics && this.currentStatistics.weekly && this.currentStatistics.weekly.length >= week) {
          const overall = this.currentStatistics?.weekly[week].overall || 0;
          return overall > 0 ? Utils.percentAsColor(this.currentStatistics?.weekly[week].overall || 0) : 'white';
        }
      }
    }
    return 'white';
  }

  weekProgress(): number {
    return (this.currentStatistics?.weekly[this.currentWeek].overall || 0)  * 100.0;
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
    return cycleTarget > 0 ? cycleTarget * (7 / this.cycleDays) : 0;
  }

  //
  // Daily Related Values
  //

  dailyProgress(formArray: FormArray, controlName: string) {
    return this.progressOf(formArray, controlName, this.dailyGoal);
  }

  dailyGoal(name: string): number {
    const cycleTarget = _.get(this.currentCycle?.requirements || {}, name, 0) as number;
    return cycleTarget > 0 ? cycleTarget * (1 / this.cycleDays) : 0;
  }

  //
  // Cycle Related Values
  //

  cycleProgress(): number {
    return (this.currentStatistics?.cycle.overall || 0)  * 100.0;
  }


  get cycleWeeks(): number {
    if (this.currentCycle) {
      return this.currentCycle?.cycleStart.until(this.currentCycle?.cycleEnd.plusDays(1), ChronoUnit.WEEKS).valueOf();
    }
    return 0;
  }

  get cycleDays(): number {
      return this.currentCycle?.cycleStart.until(this.currentCycle?.cycleEnd.plusDays(1), ChronoUnit.DAYS).valueOf() || 0;
  }

  get cycleDay(): number {
    return this.currentCycle?.cycleStart.until(this.currentDate.plusDays(1), ChronoUnit.DAYS).valueOf() || 0;
  }

  //
  // Miscelaneous 
  //

  range(size: number, startAt: number = 0): number[] {
    return Utils.range(size, startAt);
  }

  config(name: string): RequirementConfig | undefined {
    return requirementsConfig.get(name);
  }

  inRole(role: string): boolean {
    return this.currentGroups?.includes(role) || false;
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


  formDate(control: AbstractControl): LocalDate {
    return control.get('date')?.getRawValue() as LocalDate;
  }

  f(control: AbstractControl, name: string): any {
    return control.get(name)?.getRawValue();
  }

  isEditable(group: AbstractControl<any, any>): boolean {
    return group.get('date')?.disabled === true || false;
  }

  /**
   * Determine if tracking records can be edited.
   * 
   * Tracking records can be edited if the records are owned by the current user or the current user is an administrator.
   * 
   * @param group the reactive FormGroup being checked
   * @returns 
   */
  canEdit(group: AbstractControl<any, any>): boolean {
    if (this.currentGroups?.includes('bob')) {
      return true;
    }
    if (this.currentDate.isBefore(this.weekStarts) || this.currentDate.isAfter(this.weekEnds)) {
      return false;
    }
    return this.currentCandidate?.userId === this.currentUser?.uid;
  }

  canEditTitle(group: AbstractControl): string {
    if (this.currentDate.isBefore(this.weekStarts) || this.currentDate.isAfter(this.weekEnds)) {
      return 'Candidates can only edit the current week. Please contact an adminstrator.';
    }
    return this.currentCandidate?.userId !== this.currentUser?.uid ? 'Candidates can only edit their own tracking numbers.' : '';
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
                this.fetchCandidateTracking(this.currentCandidate, this.weekStarts, this.weekEnds);
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
                this.fetchCandidateTracking(this.currentCandidate, this.weekStarts, this.weekEnds);
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
          this.fetchCandidateTracking(candidate, this.weekStarts, this.weekEnds);
        }
      });
  }


  ngOnInit(): void {
    combineLatest([this.route.queryParamMap, this.fireAuth.authState, this.fireAuth.idTokenResult]).subscribe({
      next: ([paramsMap, user, idToken]) => {
        this.paramsMap = paramsMap;
        this.currentUser = user;
        this.currentGroups = idToken?.claims['groups'] || [];

        // We have our query parameters and our user... load the cycle and tracking data
        this.fetchCycle();
      }
    });
  }

  private formArrayInitializer(fields: string[], tracking?: Tracking[] | undefined): FormGroup[] {
    let formArrayGroups: FormGroup[] = [];

    if (tracking === undefined) {
      this.weekDays.forEach((weekDay, day) => {
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
            formArrayGroup.set(fieldName, this.fb.nonNullable.control(value, requirementsConfig.get(fieldName)?.validators));
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

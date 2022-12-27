import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import firebase from 'firebase/compat/app';
import { Tracking } from '@core/interfaces/tracking';
import { combineLatest } from 'rxjs';
import * as _ from 'underscore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html',
  styleUrls: ['./edit-button.component.scss']
})
export class EditButtonComponent {
  @Input('for') formControl: AbstractControl | undefined;
  @Input('row') index: number = 0;

  paramsMap: ParamMap | undefined;
  
  currentUser: firebase.User | null | undefined;
  currentGroups: string[] = [];

  constructor(
    private logger: NGXLogger,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private fireAuth: AngularFireAuth
  ) {}


  isEditable(): boolean {
    return this.formControl?.disabled === true || false;
  }

  /**
   * Determine if tracking records can be edited.
   * 
   * Tracking records can be edited if the records are owned by the current user or the current user is an administrator.
   * 
   * @param group the reactive FormGroup being checked
   * @returns 
   */
  canEdit(): boolean {
    if (this.currentGroups?.includes('admin')) {
      return true;
    }
    return false;
  }

  canEditTitle(): string {
    return '';
  }

  edit(index: number) {
    this.logger.debug(`edit(...)`, this.formControl, index);
    // Allow editing of this group
    this.formControl?.enable();
    // Never enable journals!
    this.formControl?.get('journals')?.disable();
  }

  save(index: number) {
    this.logger.debug(`save(...)`, this.formControl, index);
    this.formControl?.updateValueAndValidity();

    // Disallow editing of this group
    this.formControl?.disable();
  }

  cancel(index: number) {
    this.logger.debug(`cancel(...)`, this.formControl, index);
    // Disallow editing of this group
    this.formControl?.reset();
    this.formControl?.disable();
  }


  ngOnInit(): void {
    combineLatest([this.route.queryParamMap, this.fireAuth.authState, this.fireAuth.idTokenResult]).subscribe({
      next: ([paramsMap, user, idToken]) => {
        this.paramsMap = paramsMap;
        this.currentUser = user;
        this.currentGroups = idToken?.claims['groups'] || [];
      }
    });
  }
}

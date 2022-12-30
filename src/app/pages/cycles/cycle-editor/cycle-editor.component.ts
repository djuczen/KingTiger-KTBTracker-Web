import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXLogger } from 'ngx-logger';
import * as  _ from 'underscore';

import { Cycle } from '@core/interfaces/cycle';
import { CustomValidators } from '@features/custom-validators';
import { RequirementConfig, RequirementsConfiguration } from '@core/config/requirements.config';
import { LocalDate } from '@js-joda/core';
import { CyclesService } from '@core/services/cycles.service';
import { firstValueFrom } from 'rxjs';
import { Requirements } from '@core/interfaces/requirements';


@Component({
  selector: 'app-cycle-editor',
  templateUrl: './cycle-editor.component.html',
  styleUrls: ['./cycle-editor.component.scss']
})
export class CycleEditorComponent implements OnInit {

  @Input() defaults: Cycle | null = null;

  @Input() cycle: Cycle | null = null;
  @Output() cycleChange: EventEmitter<Cycle> = new EventEmitter<Cycle>();

  editorForm: FormGroup = new FormGroup({});

  ngbStartDate: NgbDateStruct = { year: 0, month: 0, day: 0 };
  ngbEndDate: NgbDateStruct = { year: 0, month: 0, day: 0 };

  physical: Map<string, RequirementConfig> = RequirementsConfiguration.physical;
  classes: Map<string, RequirementConfig> = RequirementsConfiguration.classes;
  other: Map<string, RequirementConfig> = RequirementsConfiguration.other;

  constructor(
    private logger: NGXLogger,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cyclesService: CyclesService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {}

  f(path: string | (string | number)[]): FormControl {
    return this.editorForm.get(path) as FormControl;
  }

  hasErrors(path: string | (string | number)[]): boolean {
    return this.editorForm.get(path)?.errors ? true : false;
  }

  hasError(path: string | (string | number)[], error: string): boolean {
    return this.editorForm.hasError(error, path);
  }

  onSubmit() {
    this.editorForm.updateValueAndValidity();

    // Update the Cycle data from the form and generate read-only fields...
    this.cycle = this.editorForm.value as Cycle;
    this.cycle.alias = encodeURIComponent(this.cycle.title.replace(' ', '-').toLowerCase());
    this.cycle.cycleWeekStart = this.cycle.cycleStart.dayOfWeek().value();

    // Emit the change back to the parent component
    this.cycleChange.emit(this.cycle);

    window.alert(`Form submitted: ${JSON.stringify(this.editorForm.value)}`);
    
    // Signal that we have closed the modal with 'Submit'
    this.activeModal.close('Submit');
  }

  onReset() {
    this.editorForm.reset();
    this.buildEditorForm();
  }

  ngOnInit(): void {
    if (!this.defaults) {
      this.defaults = this.cycle;
    }

    this.buildEditorForm();
    this.logger.debug('ngOnInit', this.editorForm);
  }

  private buildEditorForm() {
    _.map(RequirementsConfiguration.all, function(config: RequirementConfig, key: string) {
      return [key, config.default];
    })
    this.editorForm = this.fb.nonNullable.group({
      id: [this.cycle?.id || 0, []],
      title: [this.cycle?.title || '', [Validators.required]],
      alias: [this.cycle?.alias || null, []],
      cycleStart: [this.cycle?.cycleStart || LocalDate.now(), [Validators.required]],
      cycleEnd: [this.cycle?.cycleEnd || LocalDate.now(), [Validators.required]],
      cyclePreStart: [this.cycle?.cyclePreStart || null, []],
      cyclePostEnd: [this.cycle?.cyclePostEnd || null, []],
      cycleWeekStart: [this.cycle?.cycleWeekStart || 0, []],
      requirements: this.fb.group(_.mapObject(this.cycle?.requirements || this.defaultRequirements(), function(value, key) {
        return [value, [...RequirementsConfiguration.all.get(key)?.validators || []]];
      }))
    });
    this.editorForm.setValidators(CustomValidators.validateCycleDates());
    this.logger.debug('buildEditorForm...', this.editorForm);
  }

  private extractEditorForm() {

    if (!this.cycle) {
      this.cycle = {} as Cycle;
    }

    if (this.f('title').dirty || this.f('title').touched) {
      this.cycle.title = this.f('title').value;
    }
    if (this.f('alias').dirty || this.f('alias').touched) {
      this.cycle.alias = this.f('alias').value;
    } else {
      if (this.cycle.id == 0) {
        this.cycle.alias = this.cycle.title.replace(' ', '-').toLowerCase();
      }
    }
    if (this.f('cycleStart').dirty || this.f('cycleStart').touched) {
      this.cycle.cycleStart = this.f('cycleStart').value as LocalDate;
    }
    if (this.f('cycleEnd').dirty || this.f('cycleEnd').touched) {
      this.cycle.cycleEnd = this.f('cycleEnd').value as LocalDate;
    }
    if (this.f('cyclePreStart').dirty || this.f('cyclePreStart').touched) {
      this.cycle.cyclePreStart = this.f('cyclePreStart').value as LocalDate;
    }
    if (this.f('cyclePostEnd').dirty || this.f('cyclePostEnd').touched) {
      this.cycle.cyclePostEnd = this.f('cyclePostEnd').value as LocalDate;
    }
    RequirementsConfiguration.all.forEach((config, requirement) => {
      if (this.f('requirements.'+requirement).dirty || this.f('requirements.'+requirement).touched) {
    
      }
    })
  }

  private defaultRequirements(): Requirements {
    this.logger.debug('defaultRequirements', RequirementsConfiguration.all);
    return _.mapObject(Object.fromEntries(RequirementsConfiguration.all), function (config: RequirementConfig, key: string) {
      return config.default;
    }) as unknown as Requirements;
  }
}

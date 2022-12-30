import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RequirementsConfiguration } from '@core/config/requirements.config';
import { Requirements } from '@core/interfaces/requirements';


@Component({
  selector: 'app-requirements-editor',
  templateUrl: './requirements-editor.component.html',
  styleUrls: ['./requirements-editor.component.scss']
})
export class RequirementsEditorComponent implements OnInit {
  @Input() requirements: Requirements | undefined;
  @Input() controls: Requirements | undefined;

  controlsMap: Map<string, any> = new Map();

  requirementsMap: Map<string, any> = new Map();
  requirementsForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.requirementsForm = new FormGroup({});
   }

  requirementNames(): string[] {
    let names: string[] = [];
    for (const [key, value] of Object.entries(this.controls || {})) {
      if (value > 0) {
        names.push(key);
      }
    }
    return names;
  }

  onInputChange(event: Event, field: string) {
    const fieldInput = parseInt((event.target as HTMLInputElement).value.toString());
    if (fieldInput < 0 || fieldInput > (this.controlsMap.get(field) || 0)) {
      this.requirementsForm.patchValue({ [field]: Math.min(Math.max(fieldInput, 0), (this.controlsMap.get(field) || 0))});
    }
  }

  onRangeChange(event: Event, field: string) {
    this.requirementsForm.patchValue({ [field]: (event.target as HTMLInputElement).value });
  }

  fieldInput(field: string): number {
    return parseInt(this.requirementsForm.get(field)?.value || '0');
  }

  fieldMax(field: string): number {
    if (['miles', 'jumps'].includes(field)) {
      return parseFloat(this.controlsMap.get(field) || '0.0');
    }
    return parseInt(this.controlsMap.get(field) || '0');
  }

  isMin(field: string): boolean {
    return this.fieldInput(field) === 0;
  }

  isMax(field: string): boolean {
    return this.fieldInput(field) === this.fieldMax(field);
  }

  requirementTitle(field: string): string {
    return RequirementsConfiguration.all.get(field)?.title || '-?-';
  }

  requirementMax(field: string): number {
    const requirementMap = new Map(Object.entries(this.controls || {}));
    return requirementMap.get(field) || 0;
  }

  increment(field: string) {
    this.requirementsForm.patchValue({ [field]: Math.min(this.fieldInput(field) + 1, this.fieldMax(field)) });
  }

  decrement(field: string) {
    this.requirementsForm.patchValue({ [field]: Math.max(this.fieldInput(field) - 1, 0) });
  }

  ngOnInit(): void {
    // Build the map of available requirements
    for (const [key, value] of Object.entries(this.controls || {})) {
      if (value > 0) {
        this.controlsMap.set(key, value);
      }
    }

    this.requirementsMap = new Map(Object.entries(this.requirements || {}));
    
    this.requirementsForm = this.fb.group(this.requirements || {});

    // Handle ranged input for 'miles'
    this.requirementsForm.get('miles')?.valueChanges
      .subscribe((value) => {
        if (value < 0 || value > (this.controls?.miles || 0)) {
          this.requirementsForm.patchValue({ miles: Math.min(Math.max(value, 0), (this.controls?.miles || 0)) });
        }
      });
    this.requirementsForm.get('miles__range')?.valueChanges
      .subscribe((value) => {
        this.requirementsForm.patchValue({ miles: value });
      });
  }

}

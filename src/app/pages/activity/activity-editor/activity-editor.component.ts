import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RequirementConfig, RequirementsConfiguration } from '@core/config/requirements.config';
import { Tracking } from '@core/interfaces/tracking';
import { NGXLogger } from 'ngx-logger';
import * as _ from 'underscore';


@Component({
  selector: 'app-activity-editor',
  templateUrl: './activity-editor.component.html',
  styleUrls: ['./activity-editor.component.scss']
})
export class ActivityEditorComponent implements OnInit {

  @Input() tracking: Tracking | null = null;
  @Input() fields: string[] = [];

  public editorForm: FormGroup = new FormGroup({});

  constructor(
    private logger: NGXLogger,
    private fb: FormBuilder
  ) {
    this.logger.debug('ActivityEditorComponent', this.tracking, this.fields);

  }

  getConfig(name: string): RequirementConfig | undefined {
    return RequirementsConfiguration.all.get(name);
  }

  ngOnInit(): void {
    this.logger.debug('ActivityEditorComponent::bgOnInit', this.tracking, this.fields);
    this.editorForm = this.fb.group(
      _.mapObject(_.pick(this.tracking?.requirements || {}, this.fields), (value, key) => {
        return this.fb.control(value);
      })
    );
    this.editorForm.get('journals')?.disable();
    this.logger.debug('editorForm', this.editorForm);
  }
  
}

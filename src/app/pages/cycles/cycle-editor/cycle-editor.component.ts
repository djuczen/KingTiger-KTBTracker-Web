import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Cycle } from '@core/interfaces/cycle';
import { RequirementConfig, requirementsConfig } from '@core/interfaces/requirements';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-cycle-editor',
  templateUrl: './cycle-editor.component.html',
  styleUrls: ['./cycle-editor.component.scss']
})
export class CycleEditorComponent implements OnInit {

  @Input() cycle: Cycle | null | undefined;
  
  editorForm: FormGroup = new FormGroup({});

  ngbStartDate: NgbDateStruct = { year: 0, month: 0, day: 0 };
  ngbEndDate: NgbDateStruct = { year: 0, month: 0, day: 0 };

  constructor(
    private logger: NGXLogger,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {}

  asTitle(name: string): string {
    return name.slice(0, 1).toUpperCase() + name.slice(1);
  }
  
  config(name: string): RequirementConfig {
    return requirementsConfig.get(name) || { title: '-?-', description: '', units: '', validators: [] };
  }

  fetchCycle(cycleId?: number | string) {

  }

  ngOnInit(): void {
    this.editorForm = this.fb.group(this.cycle || {});
    this.editorForm.setControl('requirements', this.fb.group(this.cycle?.requirements || {}));
    this.editorForm.setControl('metadata', this.fb.group(this.cycle?.metadata || {}));
    this.logger.debug('ngOnInit', this.editorForm);
  }
}

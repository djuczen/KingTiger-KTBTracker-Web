import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Cycle } from '@core/interfaces/cycle';
import { CyclesService } from '@core/services/cycles.service';
import { ChronoUnit } from '@js-joda/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXLogger } from 'ngx-logger';
import { CycleEditorComponent } from './cycle-editor/cycle-editor.component';

@Component({
  selector: 'app-cycles',
  templateUrl: './cycles.component.html',
  styleUrls: ['./cycles.component.scss']
})
export class CyclesComponent implements OnInit {

  cyclesForm: FormGroup = new FormGroup({});

  cyclesList: Cycle[] = [];
  
  constructor(
    private logger: NGXLogger,
    private fb: FormBuilder,
    private cyclesService: CyclesService,
    private modalService: NgbModal
  ) {
    this.cyclesForm = this.fb.group({
      cycles: this.fb.array([]),
    });
  }

  cycleWeeks(cycle: Cycle): number {
    return cycle.cycleStart.until(cycle.cycleEnd.plusDays(1), ChronoUnit.WEEKS).valueOf();
  }

  cycleDays(cycle: Cycle): number {
    return cycle.cycleStart.until(cycle.cycleEnd.plusDays(1), ChronoUnit.DAYS).valueOf();
  }

  get cycles(): FormArray {
    return this.cyclesForm.get('cycles') as FormArray;
  }

  openEditor(cycle: Cycle) {
    window.alert(`Cycle: ${JSON.stringify(cycle)}`)
    const modalRef = this.modalService.open(CycleEditorComponent, { size: 'xl', scrollable: true });
    modalRef.componentInstance.cycle = cycle;
  }

  getCycles() {
    this.cyclesService.getCycles()
      .subscribe({
        next: (cycles) => {
          this.cyclesList = cycles;

          cycles.forEach((cycle, index) => {
            const cycleForm = this.fb.group({
              title: [cycle.title],
              cycleStart: [cycle.cycleStart],
              cycleEnd: [cycle.cycleEnd]
            });
            this.cycles.push(cycleForm);
          });
          this.cyclesForm.disable();
        }
      });
  }

  ngOnInit(): void {
      this.getCycles();
  }
}

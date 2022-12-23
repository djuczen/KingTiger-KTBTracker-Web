import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-progress-meter',
  templateUrl: './progress-meter.component.html',
  styleUrls: ['./progress-meter.component.scss']
})
export class ProgressMeterComponent implements OnInit {
  @Input() progress: number = 0.0;
  @Input() marks: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  /**
   * Return a width value between 0.0% and 100.0%.
   */
  get meterWidth(): {[klass: string]: any; } {
    return {'width': (Math.min(Math.max(this.progress, 0.0), 1.0) * 100.0)+'%'};
  }

  get percentComplete(): string {
    return Math.max(this.progress, 0.0) * 100.0 + '%';
  }

  getMarks(): number[] {
    if (this.marks > 0) {
      return Array.from({length: (this.marks - 1)}, (_, i) => (((i + 1) / this.marks) * 100.0));
    }
    return [];
  }
}

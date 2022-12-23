import { Component, Input, OnInit } from '@angular/core';
import { ChronoUnit, LocalDate } from '@js-joda/core';

import { Cycle } from '@core/interfaces/cycle';
import { ActivatedRoute } from '@angular/router';
import { FullStatistics } from '@core/interfaces/full-statistics';
import { Utils } from '@core/utils';


@Component({
  selector: 'cycle-week-header',
  templateUrl: './cycle-week-header.component.html',
  styleUrls: ['./cycle-week-header.component.scss']
})
export class CycleWeekHeaderComponent implements OnInit {

  @Input('cycle') currentCycle: Cycle | undefined;
  
  @Input('stats') currentStatistics: FullStatistics | undefined;


  constructor(private route: ActivatedRoute) { }


  get currentRoute() {
    return this.route.snapshot.url;
  }

  get currentDate(): LocalDate {
    return LocalDate.now();
  }

  get currentWeek(): number {
    if (this.route.snapshot.paramMap?.get('week') !== null) {
      return Math.min(Math.max(parseInt(this.route.snapshot.paramMap?.get('week') || '1') - 1, 0), this.cycleWeeks);
    } 
    return  Math.min(Math.max(this.currentCycle?.cycleStart.until(this.currentDate.plusDays(1), ChronoUnit.WEEKS) || 0, 0), this.cycleWeeks);
  }

  get weekStarts(): LocalDate {
    if (this.currentCycle) {
      return this.currentCycle?.cycleStart.plusWeeks(this.currentWeek);
    }
    return this.currentDate.minusDays(this.currentDate.dayOfWeek().value());
  }

  get weekEnds(): LocalDate {
    return this.weekStarts.plusDays(6);
  }

  get cycleWeeks(): number {
    if (this.currentCycle) {
      return this.currentCycle?.cycleStart.until(this.currentCycle?.cycleEnd.plusDays(1), ChronoUnit.WEEKS).valueOf();
    }
    return 0;
  }

  get cycleDays(): number {
    if (this.currentCycle) {
      return this.currentCycle?.cycleStart.until(this.currentCycle?.cycleEnd.plusDays(1), ChronoUnit.DAYS).valueOf();
    }
    return 0;
  }

  range(size: number, startAt?: number): number[] {
    return Utils.range(size, startAt);
  }

  weekProgress(): number {
    console.debug(`[DEBUG] weekProgress`, this.currentStatistics, this.currentWeek);
    if (this.currentStatistics && this.currentWeek < this.currentStatistics.weekly.length) {
      return (this.currentStatistics.weekly[this.currentWeek].overall)  * 100.0;
    }
    return 0;
  }

  weekColor(week: number): string {
    if (week >= 0 && week < this.cycleWeeks) {
      if (this.currentStatistics && this.currentStatistics.weekly && this.currentStatistics.weekly.length >= week) {
        const overall = this.currentStatistics?.weekly[week].overall || 0;
        return Utils.percentAsColor(this.currentStatistics?.weekly[week].overall || 0);
      }
    }
    return 'white';
  }

  ngOnInit(): void {
  }

}

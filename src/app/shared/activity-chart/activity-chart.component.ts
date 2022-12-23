import { Component, Input, OnInit } from '@angular/core';
import { Utils } from '@core/utils';


@Component({
  selector: 'app-activity-chart',
  templateUrl: './activity-chart.component.html',
  styleUrls: ['./activity-chart.component.scss']
})
export class ActivityChartComponent implements OnInit {
  @Input() percent: number = 0;
  @Input() size: string | number = 100;

  constructor() { }

  get progressPct(): number {
    return Math.round(Math.max(Math.min(this.asDecimalPct(this.percent), 100), 0));
  }

  get progessStyle() {
    const styles = { 
      'stroke-dasharray': this.asIntegerPct(this.percent) + ' 100',
      'stroke': Utils.percentAsColor(this.asDecimalPct(this.percent))
    };
    return styles;
  }

  get progressSize() {
    const cssSize: string = (typeof this.size === 'number') ? Math.round(this.size)+'px' : this.size;
    const styles = {
      'height': cssSize,
      'width': cssSize
    }
    return styles;
  }

  private asIntegerPct(value: string | number): number {
    const integerPct = Math.round(Math.max(Math.min(this.asDecimalPct(this.percent), 1.0), 0.0) * 100);
    //console.debug(`[DEBUG] asIntegerPct`, value, integerPct);
    return integerPct;
  }

  private asDecimalPct(value: string | number): number {
    const decimalPct = parseFloat(value.toString());
    //console.debug(`[DEBUG] asDecimalPct`, value, decimalPct, Math.abs(decimalPct), decimalPct / 100.0);
    return (Math.abs(decimalPct) > 1.0) ? (decimalPct / 100.0) : decimalPct;
  }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Cycle } from 'src/app/shared/model/cycle';
import { CyclesService } from 'src/app/shared/services/cycles.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentCycle: Cycle | undefined;

  constructor(
    private cyclesService: CyclesService,
    public auth: AngularFireAuth) { }

  ngOnInit(): void {
    this.cyclesService.getCurrentCycle()
      .subscribe((cycle) => {
        console.log('Cycle: ', cycle);
        this.currentCycle = cycle;
      });
  }

}

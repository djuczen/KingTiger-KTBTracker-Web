import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleWeekHeaderComponent } from './cycle-week-header.component';

describe('WeekHeaderComponent', () => {
  let component: CycleWeekHeaderComponent;
  let fixture: ComponentFixture<CycleWeekHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CycleWeekHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CycleWeekHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

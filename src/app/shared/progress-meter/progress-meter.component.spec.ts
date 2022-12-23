import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressMeterComponent } from './progress-meter.component';

describe('ProgressMeterComponent', () => {
  let component: ProgressMeterComponent;
  let fixture: ComponentFixture<ProgressMeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressMeterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

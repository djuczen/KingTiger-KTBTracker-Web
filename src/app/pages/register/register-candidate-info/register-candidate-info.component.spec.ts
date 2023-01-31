import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCandidateInfoComponent } from './register-candidate-info.component';

describe('RegisterCandidateInfoComponent', () => {
  let component: RegisterCandidateInfoComponent;
  let fixture: ComponentFixture<RegisterCandidateInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterCandidateInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterCandidateInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

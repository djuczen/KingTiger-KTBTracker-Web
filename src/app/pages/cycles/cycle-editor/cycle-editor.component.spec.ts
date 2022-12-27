import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleEditorComponent } from './cycle-editor.component';

describe('CycleEditorComponent', () => {
  let component: CycleEditorComponent;
  let fixture: ComponentFixture<CycleEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CycleEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CycleEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

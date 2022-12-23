import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementsEditorComponent } from './requirements-editor.component';

describe('RequirementsEditorComponent', () => {
  let component: RequirementsEditorComponent;
  let fixture: ComponentFixture<RequirementsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequirementsEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequirementsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

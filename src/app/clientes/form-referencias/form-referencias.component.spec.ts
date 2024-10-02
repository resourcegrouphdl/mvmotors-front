import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReferenciasComponent } from './form-referencias.component';

describe('FormReferenciasComponent', () => {
  let component: FormReferenciasComponent;
  let fixture: ComponentFixture<FormReferenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormReferenciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormReferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

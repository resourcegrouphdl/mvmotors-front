import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTitularComponent } from './form-titular.component';

describe('FormTitularComponent', () => {
  let component: FormTitularComponent;
  let fixture: ComponentFixture<FormTitularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTitularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTitularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

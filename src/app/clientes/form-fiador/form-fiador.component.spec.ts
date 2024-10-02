import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFiadorComponent } from './form-fiador.component';

describe('FormFiadorComponent', () => {
  let component: FormFiadorComponent;
  let fixture: ComponentFixture<FormFiadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFiadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFiadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

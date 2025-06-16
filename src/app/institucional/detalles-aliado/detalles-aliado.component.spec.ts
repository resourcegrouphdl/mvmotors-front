import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesAliadoComponent } from './detalles-aliado.component';

describe('DetallesAliadoComponent', () => {
  let component: DetallesAliadoComponent;
  let fixture: ComponentFixture<DetallesAliadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesAliadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesAliadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionAliadoComponent } from './seccion-aliado.component';

describe('SeccionAliadoComponent', () => {
  let component: SeccionAliadoComponent;
  let fixture: ComponentFixture<SeccionAliadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionAliadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeccionAliadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

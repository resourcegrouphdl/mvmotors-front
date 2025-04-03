import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionSorteoComponent } from './seccion-sorteo.component';

describe('SeccionSorteoComponent', () => {
  let component: SeccionSorteoComponent;
  let fixture: ComponentFixture<SeccionSorteoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionSorteoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeccionSorteoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

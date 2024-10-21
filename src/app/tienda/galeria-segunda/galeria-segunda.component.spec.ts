import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaSegundaComponent } from './galeria-segunda.component';

describe('GaleriaSegundaComponent', () => {
  let component: GaleriaSegundaComponent;
  let fixture: ComponentFixture<GaleriaSegundaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaleriaSegundaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GaleriaSegundaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

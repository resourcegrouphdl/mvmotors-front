import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaNuevasComponent } from './galeria-nuevas.component';

describe('GaleriaNuevasComponent', () => {
  let component: GaleriaNuevasComponent;
  let fixture: ComponentFixture<GaleriaNuevasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaleriaNuevasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GaleriaNuevasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

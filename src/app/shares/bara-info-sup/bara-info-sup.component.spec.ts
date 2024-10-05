import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaraInfoSupComponent } from './bara-info-sup.component';

describe('BaraInfoSupComponent', () => {
  let component: BaraInfoSupComponent;
  let fixture: ComponentFixture<BaraInfoSupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaraInfoSupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaraInfoSupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

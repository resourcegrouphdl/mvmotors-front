import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanerPublicitarioComponent } from './baner-publicitario.component';

describe('BanerPublicitarioComponent', () => {
  let component: BanerPublicitarioComponent;
  let fixture: ComponentFixture<BanerPublicitarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BanerPublicitarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BanerPublicitarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

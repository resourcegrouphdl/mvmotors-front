import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPlayComponent } from './video-play.component';

describe('VideoPlayComponent', () => {
  let component: VideoPlayComponent;
  let fixture: ComponentFixture<VideoPlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoPlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

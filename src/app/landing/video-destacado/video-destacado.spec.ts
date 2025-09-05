import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoDestacado } from './video-destacado';

describe('VideoDestacado', () => {
  let component: VideoDestacado;
  let fixture: ComponentFixture<VideoDestacado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoDestacado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoDestacado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

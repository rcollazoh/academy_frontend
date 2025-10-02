import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowImage } from './show-image';

describe('ShowImage', () => {
  let component: ShowImage;
  let fixture: ComponentFixture<ShowImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowImage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveCourse } from './active-course';

describe('ActiveCourse', () => {
  let component: ActiveCourse;
  let fixture: ComponentFixture<ActiveCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveCourse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveCourse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

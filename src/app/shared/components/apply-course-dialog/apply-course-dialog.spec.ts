import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyCourseDialog } from './apply-course-dialog';

describe('ApplyCourseDialog', () => {
  let component: ApplyCourseDialog;
  let fixture: ComponentFixture<ApplyCourseDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyCourseDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyCourseDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

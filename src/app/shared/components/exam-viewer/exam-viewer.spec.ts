import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamViewer } from './exam-viewer';

describe('ExamViewer', () => {
  let component: ExamViewer;
  let fixture: ComponentFixture<ExamViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamViewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

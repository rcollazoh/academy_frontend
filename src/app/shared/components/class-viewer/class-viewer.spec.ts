import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassViewer } from './class-viewer';

describe('ClassViewer', () => {
  let component: ClassViewer;
  let fixture: ComponentFixture<ClassViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassViewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

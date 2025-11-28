import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonFilter } from './person-filter';

describe('PersonFilter', () => {
  let component: PersonFilter;
  let fixture: ComponentFixture<PersonFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

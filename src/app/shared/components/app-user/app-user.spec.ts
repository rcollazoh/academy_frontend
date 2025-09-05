import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUser } from './app-user';

describe('AppUser', () => {
  let component: AppUser;
  let fixture: ComponentFixture<AppUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

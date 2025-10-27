import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityPolicies } from './security-policies';

describe('SecurityPolicies', () => {
  let component: SecurityPolicies;
  let fixture: ComponentFixture<SecurityPolicies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityPolicies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityPolicies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

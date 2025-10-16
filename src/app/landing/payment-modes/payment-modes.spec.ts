import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentModes } from './payment-modes';

describe('PaymentModes', () => {
  let component: PaymentModes;
  let fixture: ComponentFixture<PaymentModes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentModes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentModes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

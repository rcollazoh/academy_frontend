import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverKey } from './recover-key';

describe('RecoverKey', () => {
  let component: RecoverKey;
  let fixture: ComponentFixture<RecoverKey>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoverKey]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoverKey);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

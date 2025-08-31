import { TestBed } from '@angular/core/testing';

import { Nomenclators } from './nomenclators';

describe('Nomenclators', () => {
  let service: Nomenclators;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Nomenclators);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

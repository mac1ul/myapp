import { TestBed } from '@angular/core/testing';

import { SalesunitGuard } from './salesunit.guard';

describe('SalesunitGuard', () => {
  let guard: SalesunitGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SalesunitGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

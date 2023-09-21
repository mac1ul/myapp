import { TestBed } from '@angular/core/testing';

import { ChecksproleGuard } from './checksprole.guard';

describe('ChecksproleGuard', () => {
  let guard: ChecksproleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ChecksproleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

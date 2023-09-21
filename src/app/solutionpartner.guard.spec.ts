import { TestBed } from '@angular/core/testing';

import { SolutionpartnerGuard } from './solutionpartner.guard';

describe('SolutionpartnerGuard', () => {
  let guard: SolutionpartnerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SolutionpartnerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

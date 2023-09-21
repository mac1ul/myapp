import { TestBed } from '@angular/core/testing';

import { ChecksuroleGuard } from './checksurole.guard';

describe('ChecksuroleGuard', () => {
  let guard: ChecksuroleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ChecksuroleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

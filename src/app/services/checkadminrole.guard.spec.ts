import { TestBed } from '@angular/core/testing';

import { CheckadminroleGuard } from './checkadminrole.guard';

describe('CheckadminroleGuard', () => {
  let guard: CheckadminroleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CheckadminroleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

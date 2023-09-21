import { TestBed } from '@angular/core/testing';

import { SetbreadcrumbService } from './setbreadcrumb.service';

describe('SetbreadcrumbService', () => {
  let service: SetbreadcrumbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetbreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

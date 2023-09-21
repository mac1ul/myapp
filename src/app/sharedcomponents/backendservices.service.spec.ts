import { TestBed } from '@angular/core/testing';

import { BackendservicesService } from './backendservices.service';

describe('BackendservicesService', () => {
  let service: BackendservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

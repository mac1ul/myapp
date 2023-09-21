import { TestBed } from '@angular/core/testing';

import { AfterloginserviceService } from './afterloginservice.service';

describe('AfterloginserviceService', () => {
  let service: AfterloginserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AfterloginserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

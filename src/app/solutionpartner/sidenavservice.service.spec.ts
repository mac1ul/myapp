import { TestBed } from '@angular/core/testing';

import { SidenavserviceService } from './sidenavservice.service';

describe('SidenavserviceService', () => {
  let service: SidenavserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidenavserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

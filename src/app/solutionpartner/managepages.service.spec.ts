import { TestBed } from '@angular/core/testing';

import { ManagepagesService } from './managepages.service';

describe('ManagepagesService', () => {
  let service: ManagepagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagepagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

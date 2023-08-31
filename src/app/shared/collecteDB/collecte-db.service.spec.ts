import { TestBed } from '@angular/core/testing';

import { CollecteDBService } from './collecte-db.service';

describe('CollecteDBService', () => {
  let service: CollecteDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollecteDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

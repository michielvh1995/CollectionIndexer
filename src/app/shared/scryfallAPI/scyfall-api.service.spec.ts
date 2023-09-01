import { TestBed } from '@angular/core/testing';

import { ScyfallAPIService } from './scyfall-api.service';

describe('ScyfallAPIService', () => {
  let service: ScyfallAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScyfallAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

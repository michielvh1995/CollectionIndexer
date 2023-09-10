import { TestBed } from '@angular/core/testing';

import { ScryfallAPIService } from './scyfall-api.service';

describe('ScyfallAPIService', () => {
  let service: ScryfallAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScryfallAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

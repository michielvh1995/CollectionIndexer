import { TestBed } from '@angular/core/testing';

import { WizardsAPIService } from './wizards-api.service';

describe('WizardsAPIService', () => {
  let service: WizardsAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WizardsAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

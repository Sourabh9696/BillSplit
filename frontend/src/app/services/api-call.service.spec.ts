import { TestBed, inject } from '@angular/core/testing';

import { ApiCallService } from './api-call.service';

describe('DmsCallService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiCallService]
    });
  });

  it('should be created', inject([ApiCallService], (service: ApiCallService) => {
    expect(service).toBeTruthy();
  }));
});

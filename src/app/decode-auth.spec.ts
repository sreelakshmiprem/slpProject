import { TestBed } from '@angular/core/testing';

import { DecodeAuth } from './decode-auth';

describe('DecodeAuth', () => {
  let service: DecodeAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecodeAuth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

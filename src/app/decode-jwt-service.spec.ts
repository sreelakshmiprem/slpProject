import { TestBed } from '@angular/core/testing';

import { DecodeJwtService } from './decode-jwt-service';

describe('DecodeJwtService', () => {
  let service: DecodeJwtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecodeJwtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

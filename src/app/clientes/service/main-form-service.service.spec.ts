import { TestBed } from '@angular/core/testing';

import { MainFormServiceService } from './main-form-service.service';

describe('MainFormServiceService', () => {
  let service: MainFormServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainFormServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

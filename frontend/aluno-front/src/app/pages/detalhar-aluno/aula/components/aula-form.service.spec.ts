import { TestBed } from '@angular/core/testing';

import { AulaFormService } from './aula-form.service';

describe('AulaFormService', () => {
  let service: AulaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AulaFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

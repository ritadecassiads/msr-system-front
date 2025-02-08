import { TestBed } from '@angular/core/testing';

import { ModalMessageService } from '../modal-message.service';

describe('ModalMessageService', () => {
  let service: ModalMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

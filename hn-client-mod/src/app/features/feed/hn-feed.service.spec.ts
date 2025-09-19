import { TestBed } from '@angular/core/testing';

import { HnFeedService } from './hn-feed.service';

describe('HnFeedService', () => {
  let service: HnFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HnFeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

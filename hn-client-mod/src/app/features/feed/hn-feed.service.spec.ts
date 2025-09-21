// src/app/features/feed/hn-feed.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { HnFeedService } from './hn-feed.service';
import { HnApiService } from '../../core/hn-api.service';
import { HnItem } from '../../core/hn.models';

describe('HnFeedService (init – simple test)', () => {
  let service: HnFeedService;
  let api: jasmine.SpyObj<HnApiService>;

  beforeEach(() => {
    api = jasmine.createSpyObj<HnApiService>('HnApiService', [
      'getTopIds',
      'getItem',
    ]);

    TestBed.configureTestingModule({
      providers: [
        HnFeedService,
        { provide: HnApiService, useValue: api },
      ],
    });

    service = TestBed.inject(HnFeedService);
  });

  it('init(top) should load first page of items and set state correctly', async () => {
    const ids = [1, 2, 3];
    api.getTopIds.and.returnValue(of(ids));

    api.getItem.and.callFake((id: number) =>
      of({
        id,
        type: 'story',
        by: 'tester',
        time: 123,
        title: `Item ${id}`,
        url: `https://example.com/${id}`,
      } as HnItem)
    );

    await service.init('top'); 

    const items = service.items(); 

    expect(items.length).toBe(3);          
    expect(items[0].id).toBe(1);           
    expect(items[1].title).toBe('Item 2'); 
    expect(items[2].url).toContain('/3');  

    expect(service.state).toBe('ready');
    expect(service.hasPrev).toBeFalse();  
    expect(service.hasNext).toBeFalse();  
  });
});

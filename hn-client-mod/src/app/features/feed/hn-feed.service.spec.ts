// src/app/features/feed/hn-feed.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { HnFeedService } from './hn-feed.service';
import { HnApiService } from '../../core/hn-api.service';
import { HnItem } from '../../core/hn.models';

describe('HnFeedService (init() simple test)', () => {
  let service: HnFeedService;
  let api: jasmine.SpyObj<HnApiService>;

  beforeEach(() => {
    api = jasmine.createSpyObj<HnApiService>('HnApiService', [
      'getTopIds',
      'getItem',
    ]);

    TestBed.configureTestingModule({
      providers: [HnFeedService, { provide: HnApiService, useValue: api }],
    });

    service = TestBed.inject(HnFeedService);
  });

  //init() function test
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

  //nextPage() and prevPage() test
  function mkItem(id: number, patch: Partial<HnItem> = {}): HnItem {
    return {
      id,
      type: 'story',
      by: 'tester',
      time: 123,
      title: `Item ${id}`,
      url: `https://example.com/${id}`,
      ...patch,
    };
  }

  it('nextPage() should move to page 2 and set flags', async () => {
    const ids = Array.from({ length: 35 }, (_, i) => i + 1);
    api.getTopIds.and.returnValue(of(ids));
    api.getItem.and.callFake((id: number) => of(mkItem(id)));

    await service.init('top');
    await service.nextPage();

    const items = service.items();
    expect(items.length).toBe(15);
    expect(items[0].id).toBe(21);
    expect(items[items.length - 1].id).toBe(35);

    expect(service.hasPrev).toBeTrue();
    expect(service.hasNext).toBeFalse();
    expect(service.state).toBe('ready');
  });

  it('prevPage() should move back to page 1 and set flags', async () => {
    const ids = Array.from({ length: 35 }, (_, i) => i + 1);
    api.getTopIds.and.returnValue(of(ids));
    api.getItem.and.callFake((id: number) => of(mkItem(id)));

    await service.init('top');
    await service.nextPage();
    await service.prevPage();

    const items = service.items();
    expect(items.length).toBe(20);
    expect(items[0].id).toBe(1);
    expect(items[items.length - 1].id).toBe(20);

    expect(service.hasPrev).toBeFalse();
    expect(service.hasNext).toBeTrue();
    expect(service.state).toBe('ready');
  });

  //reset() test

  it('reset() should clear items and flags', async () => {
    api.getTopIds.and.returnValue(of([1, 2, 3]));
    api.getItem.and.callFake((id: number) => of(mkItem(id)));

    await service.init('top');
    expect(service.items().length).toBeGreaterThan(0);

    service.reset();
    expect(service.items().length).toBe(0);
    expect(service.hasPrev).toBeFalse();
    expect(service.hasNext).toBeFalse();
    expect(service.state).toBe('idle'); 
  });
});

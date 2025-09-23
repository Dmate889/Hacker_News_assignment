import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { FeedComponent } from './feed.component';
import { HnFeedService } from '../hn-feed.service';
import { ActivatedRoute } from '@angular/router';
import { HnItem } from '../../../core/hn.models';

describe('FeedComponent (simple)', () => {
  let fixture: ComponentFixture<FeedComponent>;
  let component: FeedComponent;
  let feedSvc: jasmine.SpyObj<HnFeedService>;

  const data$ = new BehaviorSubject<{ feed: string }>({ feed: 'top' });

  beforeEach(async () => {
    feedSvc = jasmine.createSpyObj<HnFeedService>('HnFeedService', [
      'init',
      'items',
    ]);

    feedSvc.items.and.returnValue([
      { id: 1, type: 'story', title: 'A', by: 'alice' } as HnItem,
      { id: 2, type: 'story', title: 'B', by: 'bob' } as HnItem,
    ]);

    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [FeedComponent],
      providers: [
        { provide: HnFeedService, useValue: feedSvc },
        {
          provide: ActivatedRoute,
          useValue: {
            data: data$.asObservable(),
            snapshot: { data: { feed: 'top' } },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedComponent);
    component = fixture.componentInstance;
  });

  it('ngOnInit(): reads route kind and calls feed.init(kind)', async () => {
    await component.ngOnInit();
    expect(component.kind).toBe('top' as any);
    expect(feedSvc.init).toHaveBeenCalledOnceWith('top' as any);
  });

  it('retry(): re-calls feed.init() with current kind', () => {
    component['kind'] = 'best' as any;
    component.retry();
    expect(feedSvc.init).toHaveBeenCalledWith('best' as any);
  });

  it('itemLink(): falls back to HN item page when url is missing', () => {
    const a = component.itemLink({ id: 5, url: 'https://x.y' } as HnItem);
    const b = component.itemLink({ id: 6 } as HnItem);
    expect(a).toBe('https://x.y');
    expect(b).toBe('https://news.ycombinator.com/item?id=6');
  });

  it('trackById(): returns the item id', () => {
    expect(component.trackById(0, { id: 123 } as any)).toBe(123);
  });
});

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FeedComponent } from './feed.component';
import { HnFeedService } from '../hn-feed.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HnItem } from '../../../core/hn.models';

describe('FeedComponent (simple)', () => {
  let fixture: ComponentFixture<FeedComponent>;
  let component: FeedComponent;

  
  const data$ = new BehaviorSubject<{ feed: string }>({ feed: 'top' });

  let feedSvc: jasmine.SpyObj<HnFeedService>;

  beforeEach(async () => {
    feedSvc = jasmine.createSpyObj<HnFeedService>('HnFeedService', [
      'init',
      'nextPage',
      'prevPage',
      'items'
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
        { provide: ActivatedRoute, useValue: { data: data$.asObservable(), snapshot: { data: { feed: 'top' } } } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedComponent);
    component = fixture.componentInstance;
  });
  
  
  it('ngOnInit(): will read route feed and call init()', () => {
    fixture.detectChanges();
    expect(component.kind).toBe('top' as any);
    expect(feedSvc.init).toHaveBeenCalledOnceWith('top' as any);
  });

  it('loadNext(): delegate to service nextPage()', () => {
    fixture.detectChanges();
    component.loadNext();
    expect(feedSvc.nextPage).toHaveBeenCalled();
  });

  it('loadPrev(): delegate to service prevPage()', () => {
    fixture.detectChanges();
    component.loadPrev();
    expect(feedSvc.prevPage).toHaveBeenCalled();
  });

  it('itemLink(): without the URL we get HN fallback', () => {
    const a = component.itemLink({ id: 5, url: 'https://x.y' } as HnItem);
    const b = component.itemLink({ id: 6 } as HnItem);
    expect(a).toBe('https://x.y');
    expect(b).toBe('https://news.ycombinator.com/item?id=6');
  });

  it('trackById(): we get the item ID back', () => {
    expect(component.trackById(0, { id: 123 } as any)).toBe(123);
  });
});

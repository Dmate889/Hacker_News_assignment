import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { HnFeedService } from '@features/feed/hn-feed.service';
import { provideRouter } from '@angular/router';

describe('AppComponent (pager functionality only)', () => {
  let fixture: ComponentFixture<AppComponent>;
  let feedSvc: jasmine.SpyObj<HnFeedService>;

  beforeEach(async () => {
    feedSvc = jasmine.createSpyObj<HnFeedService>('HnFeedService', [
      'nextPage',
      'prevPage',
    ]);
    feedSvc.nextPage.and.returnValue(Promise.resolve());
    feedSvc.prevPage.and.returnValue(Promise.resolve());

    (feedSvc as any).hasNext = true;
    (feedSvc as any).hasPrev = true;
    (feedSvc as any).state = 'ready';

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: HnFeedService, useValue: feedSvc },
        provideRouter([]),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  function getPrevNext() {
    const el: HTMLElement = fixture.nativeElement;
    const btns = el.querySelectorAll<HTMLButtonElement>('.controls button');
    const [prevBtn, nextBtn] = Array.from(btns);
    return { prevBtn, nextBtn };
  }

  it('clicking Prev calls feed.prevPage()', () => {
    const { prevBtn } = getPrevNext();
    prevBtn.click();
    expect(feedSvc.prevPage).toHaveBeenCalledTimes(1);
  });

  it('clicking Next calls feed.nextPage()', () => {
    const { nextBtn } = getPrevNext();
    nextBtn.click();
    expect(feedSvc.nextPage).toHaveBeenCalledTimes(1);
  });
});

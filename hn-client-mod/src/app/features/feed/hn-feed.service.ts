// Service for managing Hacker News feed state, page-based pagination (20 items), and cached items, prev + next mechanism

import { Injectable } from '@angular/core';
import { firstValueFrom, from, of, lastValueFrom, Observable } from 'rxjs';
import { catchError, mergeMap, tap, toArray, finalize } from 'rxjs/operators';
import { HnApiService } from '@core/hn-api.service';
import { FeedKind, HnItem } from '@core/hn.models';

const PAGE_SIZE = 20;
const CONCURRENCY = 10;

type FeedState = 'idle' | 'loading' | 'ready' | 'error';

@Injectable({ providedIn: 'root' })
export class HnFeedService {
  private ids: number[] = [];
  private cache = new Map<number, HnItem>();
  private pageIndex = 0;

  state: FeedState = 'idle';
  errorMsg = '';
  kind: FeedKind = 'top';

  constructor(private HnApiService: HnApiService) {}

  // Story items - max 20
  items(): HnItem[] {
    const start = this.pageIndex * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    function isRenderable(i: any): i is HnItem{
      return (!!i && i.type === 'story' || i.type === 'job')
    }
    return this.ids
      .slice(start, end)
      .map((id) => this.cache.get(id))
      .filter(isRenderable);
  }

  async init(kind: FeedKind): Promise<void> {
  this.reset();
  this.kind = kind;
  try {
    let ids$: Observable<number[]>;

    switch (kind) {
      case 'top':
        ids$ = this.HnApiService.getTopIds();
        break;
      case 'new':
        ids$ = this.HnApiService.getNewIds();
        break;
      case 'best':
        ids$ = this.HnApiService.getBestIds();
        break;
      case 'ask':
        ids$ = this.HnApiService.getAskIds();
        break;
      case 'show':
        ids$ = this.HnApiService.getShowIds();
        break;
      case 'jobs':
        ids$ = this.HnApiService.getJobs();
        break;
      default:
        throw new Error(`Unsupported feed kind: ${kind}`);
    }

    this.ids = await firstValueFrom(ids$);

    if (this.ids.length > 0) {
      await this.loadPage(0);
    } else {
      this.state = 'ready';
    }
  } catch {
    this.state = 'error';
    this.errorMsg = 'Failed to load feed.';
  }
}

  //Loading pages + cache
  async loadPage(index: number): Promise<void> {
    if (this.state === 'loading') return;

    const start = index * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, this.ids.length);
    if (start >= end) return;

    this.state = 'loading';
    const slice = this.ids.slice(start, end);

    await lastValueFrom(
      //Checks if ID is in cache, if not - API call
      from(slice).pipe(
        mergeMap(
          (id) =>
            this.cache.has(id)
              ? of(this.cache.get(id)!)
              : this.HnApiService.getItem(id).pipe(catchError(() => of(null))),
          CONCURRENCY
        ),
        // Store IDs in cache - no duplicates
        tap((it) => {
          if (it && it.id != null && !this.cache.has(it.id)) {
            this.cache.set(it.id, it);
          }
        }),
        //toArray() so we will get the input in one single array
        toArray(),
        // Finalize state management
        finalize(() => {
          this.pageIndex = index;
          this.state = 'ready';
        })
      )
    );
  }

  //Go to next page if available
  async nextPage(): Promise<void> {
    if ((this.pageIndex + 1) * PAGE_SIZE < this.ids.length) {
      await this.loadPage(this.pageIndex + 1);
    }
  }

  //Go to previous page if available
  async prevPage(): Promise<void> {
    if (this.pageIndex > 0) {
      await this.loadPage(this.pageIndex - 1);
    }
  }

  //Button guards - buttons will appear only when they supposed to
  get hasNext(): boolean {
    return (this.pageIndex + 1) * PAGE_SIZE < this.ids.length;
  }
  get hasPrev(): boolean {
    return this.pageIndex > 0;
  }


  reset() {
    this.ids = [];
    this.pageIndex = 0;
    this.cache.clear();
    this.state = 'idle';
    this.errorMsg = '';
  }
}

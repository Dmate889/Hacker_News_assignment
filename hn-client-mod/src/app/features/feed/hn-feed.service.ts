// Service for managing Hacker News feed state, pagination, and cached items.

import { Injectable } from '@angular/core';
import {
  catchError,
  finalize,
  firstValueFrom,
  from,
  lastValueFrom,
  mergeMap,
  of,
  tap,
  toArray,
} from 'rxjs';
import { HnApiService } from '../../core/hn-api.service';
import { FeedKind, HnItem } from '../../core/hn.models';

const PAGE_SIZE = 20;
const CONCURRENCY = 10;

type FeedState = 'idle' | 'loading' | 'ready' | 'error';

@Injectable({
  providedIn: 'root',
})
export class HnFeedService {
  private ids: number[] = [];
  private cursor = 0;
  private cache = new Map<number, HnItem>();

  state: FeedState = 'idle';
  errorMsg: string | null = null;

  constructor(private HnApiService: HnApiService) {}

  //Getting the items from the MAP and filter these by "story" HnItemType
  items(): HnItem[] {
    return Array.from(this.cache.values()).filter((i) => i?.type === 'story');
  }

  async init(kind: FeedKind): Promise<void> {
    this.reset();
    try {
      this.ids = await firstValueFrom(
        kind === 'top'
          ? this.HnApiService.getTopIds()
          : this.HnApiService.getNewIds()
      );
      await this.loadNextPage();
      this.state = 'ready';
    } catch {
      this.state = 'error';
      this.errorMsg = 'Failed to load feed.';
    }
  }

  async loadNextPage(): Promise<void> {
    if (this.state === 'loading') return;

    const start = this.cursor;
    const end = Math.min(start + PAGE_SIZE, this.ids.length);
    if (start >= end) return;

    this.state = 'loading';

    const slice = this.ids.slice(start, end);

    await lastValueFrom(
       //For each id, fetch the item with concurrency limit
      from(slice).pipe(
        mergeMap(
          (id) =>
            this.HnApiService.getItem(id).pipe(catchError(() => of(null))),
          CONCURRENCY
        ),
        //Loading the cache
        tap((it) => {
          if (it && it.id != null && !this.cache.has(it.id)) {
            this.cache.set(it.id, it);
          }
        }),
        toArray(), 
        finalize(() => {
          this.cursor = end;
          this.state = 'ready';
        })
      )
    );
  }

  retry(kind: FeedKind) {
    return this.init(kind);
  }

  private reset() {
    this.ids = [];
    this.cursor = 0;
    this.cache.clear();
    this.state = 'idle';
    this.errorMsg = null;
  }

  get hasMore(): boolean{
    return this.cursor < this.ids.length
  }
}

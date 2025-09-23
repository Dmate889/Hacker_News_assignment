import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeedKind, HnItem } from '../../../core/hn.models';
import { HnFeedService } from '../hn-feed.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  kind: FeedKind = 'top';

  constructor(
    private route: ActivatedRoute,
    public feed: HnFeedService
  ) {}

  async ngOnInit(): Promise<void> {
    this.kind = (this.route.snapshot.data['feed'] ?? 'top') as FeedKind;
    await this.feed.init(this.kind); // loads first page automatically
  }

  // async loadNext(): Promise<void> {
  //   await this.feed.nextPage();
  // }

  // async loadPrev(): Promise<void> {
  //   await this.feed.prevPage();
  // }

  retry(): void {
    this.feed.init(this.kind);
  }

  trackById(_: number, item: HnItem): number {
    return item.id;
  }

  itemLink(it: HnItem): string {
    return it.url ?? `https://news.ycombinator.com/item?id=${it.id}`;
  }
}

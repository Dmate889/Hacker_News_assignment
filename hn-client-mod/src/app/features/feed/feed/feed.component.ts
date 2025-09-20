import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeedKind, HnItem } from '@core/hn.models';
import { HnFeedService } from '@features/feed/hn-feed.service';


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

  ngOnInit(): void {
    this.kind = (this.route.snapshot.data['feed'] ?? 'top') as FeedKind;
    this.feed.init(this.kind);
  }

  loadMore(): void {
    this.feed.loadNextPage();
  }

  retry(): void {
    this.feed.retry(this.kind);
  }

  trackById(_: number, item: HnItem): number {
    return item.id;
  }
}

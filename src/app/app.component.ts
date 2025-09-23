import { Component } from '@angular/core';
import { FeedComponent } from '@features/feed/feed/feed.component';
import { HnFeedService } from '@features/feed/hn-feed.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'hn-client-mod';

  constructor(public feed: HnFeedService) {}

  async loadNext(): Promise<void> {
    await this.feed.nextPage();
  }
  async loadPrev(): Promise<void> {
    await this.feed.prevPage();
  }
}

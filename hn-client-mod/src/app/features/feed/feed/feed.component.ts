import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent {
   kind: 'top' | 'new';

  constructor(private route: ActivatedRoute) {
    this.kind = (this.route.snapshot.data['feed'] ?? 'top') as 'top' | 'new';
  }

}

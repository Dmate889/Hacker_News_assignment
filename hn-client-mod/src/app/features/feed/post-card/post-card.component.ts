import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { HnItem } from '../../../core/hn.models';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent {
  @Input({ required: true }) item!: HnItem;

  itemLink(it: HnItem): string {
    return it.url ?? `https://news.ycombinator.com/item?id=${it.id}`;
  }
}

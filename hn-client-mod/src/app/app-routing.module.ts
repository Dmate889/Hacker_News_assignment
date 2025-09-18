import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedComponent } from './features/feed/feed/feed.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'top' },
  { path: 'top', component: FeedComponent, data: { feed: 'top' } },
  { path: 'new', component: FeedComponent, data: { feed: 'new' } },
  { path: '**', redirectTo: 'top' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

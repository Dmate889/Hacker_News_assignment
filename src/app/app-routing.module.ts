import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedComponent } from './features/feed/feed/feed.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'top' },
  { path: 'top',  component: FeedComponent, data: { feed: 'top'  } },
  { path: 'new',  component: FeedComponent, data: { feed: 'new'  } },
  { path: 'best', component: FeedComponent, data: { feed: 'best' } },
  { path: 'ask',  component: FeedComponent, data: { feed: 'ask'  } },
  { path: 'show', component: FeedComponent, data: { feed: 'show' } },
  { path: 'jobs', component: FeedComponent, data: { feed: 'jobs' } },
  { path: 'user/:id', component: UserDetailComponent },
  { path: '**', redirectTo: 'top' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeedComponent } from './features/feed/feed/feed.component';
import { TopBarComponent } from './shared/top-bar/top-bar.component';
import { PostCardComponent } from './features/feed/post-card/post-card.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    TopBarComponent,
    PostCardComponent,
    UserDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

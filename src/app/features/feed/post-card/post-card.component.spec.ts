import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostCardComponent } from './post-card.component';
import { By } from '@angular/platform-browser';
import { HnItem } from '../../../core/hn.models';
import { provideRouter, RouterModule } from '@angular/router';

describe('PostCardComponent', () => {
  let fixture: ComponentFixture<PostCardComponent>;
  let component: PostCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostCardComponent],
      imports: [
        RouterModule,       
      ],
      providers: [
        provideRouter([]), 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostCardComponent);
    component = fixture.componentInstance;
  });

  it('render: If there is no URL we get HN fallback', () => {
    component.item = {
      id: 99,
      type: 'story',
      title: 'No URL',
      by: 'bob',
    } as HnItem;

    fixture.detectChanges();

    const titleA = fixture.debugElement.query(By.css('h3 a')).nativeElement as HTMLAnchorElement;
    expect(titleA.getAttribute('href')).toBe('https://news.ycombinator.com/item?id=99');
  });

  it('render: the username at by - would point to the user page', () => {
    component.item = {
      id: 7,
      type: 'story',
      title: 'Post',
      by: 'charlie',
    } as HnItem;

    fixture.detectChanges();

    const userA = fixture.debugElement.query(By.css('.meta a')).nativeElement as HTMLAnchorElement;
    const reflect = userA.getAttribute('ng-reflect-router-link') || '';
    expect(reflect).toContain('/user,charlie');
  });
});

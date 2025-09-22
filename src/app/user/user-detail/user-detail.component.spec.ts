import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailComponent } from './user-detail.component';
import { HnApiService } from '@core/hn-api.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';

describe('UserDetailComponent', () => {
  let fixture: ComponentFixture<UserDetailComponent>;
  let component: UserDetailComponent;
  let api: jasmine.SpyObj<HnApiService>;

  beforeEach(async () => {
    
    api = jasmine.createSpyObj<HnApiService>('HnApiService', ['getUser']);

    await TestBed.configureTestingModule({
      imports: [CommonModule], 
      declarations: [UserDetailComponent],
      providers: [
        { provide: HnApiService, useValue: api },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id: 'alice' }) },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
  });

  it('ngOnInit: should call getUser() with route param and update state', () => {
    api.getUser.and.returnValue(of({ id: 'alice', karma: 123, created: 1600000000 } as any));

    fixture.detectChanges();

    expect(api.getUser).toHaveBeenCalledOnceWith('alice');
    expect(component.user?.id).toBe('alice');
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('render: should display user meta data in the DOM', () => {
    api.getUser.and.returnValue(
      of({ id: 'alice', karma: 123, created: 1600000000 } as any)
    );

    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('alice');
    expect(el.textContent).toContain('123');
  });

  it('error case: should set error state and render error message in DOM', () => {
    api.getUser.and.returnValue(throwError(() => new Error('boom')));

    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Failed to load user');

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Failed to load user'); 
  });
});

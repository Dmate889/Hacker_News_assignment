import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HnApiService } from './hn-api.service';

const BASE = 'https://hacker-news.firebaseio.com/v0';

describe('HnApiService', () => {
  let service: HnApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HnApiService,
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(HnApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  //Helper for reusing for endpoints
  function expectGetAndFlush<T>(
    httpMock: HttpTestingController,
    url: string,
    mockBody: number[]
  ) {
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockBody);
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //Endpoint tests - happy path
  it('should fetch ids from list endpoints (top/new/best/ask/show/jobs)', () => {
    const cases = [
      { call: () => service.getTopIds(), url: `${BASE}/topstories.json` },
      { call: () => service.getNewIds(), url: `${BASE}/newstories.json` },
      { call: () => service.getBestIds(), url: `${BASE}/beststories.json` },
      { call: () => service.getAskIds(), url: `${BASE}/askstories.json` },
      { call: () => service.getShowIds(), url: `${BASE}/showstories.json` },
      { call: () => service.getJobs(), url: `${BASE}/jobstories.json` },
    ];

    const mockIds = [1, 2, 3];

    cases.forEach(({ call, url }) => {
      let got: number[] | undefined;

      call().subscribe((ids) => (got = ids));
      expectGetAndFlush(httpMock, url, mockIds);

      expect(got).toEqual(mockIds);
    });
  });

  //Error path test - error path

  it('should provide HTTP error', () => {
    const status = 500;
    const statusText = 'Server Error';

    service.getTopIds().subscribe({
      next: () => fail('expected error, got success'),
      error: (err) => {
        expect(err.status).toBe(status);
        expect(err.statusText).toBe(statusText);
      },
    });

    const req = httpMock.expectOne(`${BASE}/topstories.json`);
    expect(req.request.method).toBe('GET');
    req.flush({ message: 'boom' }, { status, statusText });
  });

  //Caching test - shareReplay()
  it('should call one HTTP request and provide to different subscribers (shareReplay)', () => {
    const mockIds = [1, 2, 3];
    const obs$ = service.getTopIds();

    let a: number[] | undefined;
    let b: number[] | undefined;

    obs$.subscribe((ids) => (a = ids));
    obs$.subscribe((ids) => (b = ids));

    const req = httpMock.expectOne(`${BASE}/topstories.json`);
    req.flush(mockIds);

    expect(a).toEqual(mockIds);
    expect(b).toEqual(mockIds);
  });

  //getItem test

  it('should fetch a single item by id', () => {
    const mockItem: HnItem = {
      id: 42,
      type: 'story',
      by: 'tester',
      time: 123456,
      title: 'Test story',
      url: 'https://example.com',
    };

    let got: typeof mockItem | undefined;

    service.getItem(42).subscribe((item) => (got = item));

    const req = httpMock.expectOne(`${BASE}/item/42.json`);
    expect(req.request.method).toBe('GET');
    req.flush(mockItem);

    expect(got).toEqual(mockItem);
    expect(got?.id).toBe(42);
    expect(got?.title).toBe('Test story');
  });

  // getUser 

  it('should fetch a user by username', () => {
  const mockUser = {
    id: 'alice',
    created: 1700000000,
    karma: 777
  };

  let got: typeof mockUser | undefined;

  service.getUser('alice').subscribe(user => (got = user));

  const req = httpMock.expectOne(`${BASE}/user/alice.json`);
  expect(req.request.method).toBe('GET');
  req.flush(mockUser);

  expect(got).toEqual(mockUser);
  expect(got?.id).toBe('alice');
  expect(got?.karma).toBe(777);
});
});

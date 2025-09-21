// Service for interacting with the Hacker News API.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HnItem, HnUser } from './hn.models';
import { share, shareReplay } from 'rxjs/operators';

const BASE = 'https://hacker-news.firebaseio.com/v0';

@Injectable({
  providedIn: 'root',
})
export class HnApiService {
  constructor(private http: HttpClient) {}

  getTopIds(): Observable<number[]> {
    return this.http
      .get<number[]>(`${BASE}/topstories.json`)
      .pipe(shareReplay(1));
  }

  getNewIds(): Observable<number[]> {
    return this.http
      .get<number[]>(`${BASE}/newstories.json`)
      .pipe(shareReplay(1));
  }

  getBestIds(): Observable<number[]> {
    return this.http
      .get<number[]>(`${BASE}/beststories.json`)
      .pipe(shareReplay(1));
  }

  getAskIds(): Observable<number[]> {
    return this.http
      .get<number[]>(`${BASE}/askstories.json`)
      .pipe(shareReplay(1));
  }
  getShowIds(): Observable<number[]> {
    return this.http
      .get<number[]>(`${BASE}/showstories.json`)
      .pipe(shareReplay(1));
  }

  getJobs():Observable<number[]> {
    return this.http
    .get<number[]>(`${BASE}/jobstories.json`)
    .pipe(shareReplay(1))
  }

  getUser(username: string): Observable<HnUser>{
     return this.http.get<HnUser>(`${BASE}/user/${username}.json`);
  }

  getItem(id: number): Observable<HnItem> {
    return this.http.get<HnItem>(`${BASE}/item/${id}.json`);
  }
}

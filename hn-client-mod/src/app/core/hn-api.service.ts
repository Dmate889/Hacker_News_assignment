// Service for interacting with the Hacker News API.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HnItem } from './hn.models';
import { shareReplay } from 'rxjs/operators';

const BASE = 'https://hacker-news.firebaseio.com/v0';


@Injectable({
  providedIn: 'root'
})
export class HnApiService {

  constructor(private http: HttpClient) { }

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

  getItem(id: number): Observable<HnItem> {
    return this.http.get<HnItem>(`${BASE}/item/${id}.json`);
  }
}

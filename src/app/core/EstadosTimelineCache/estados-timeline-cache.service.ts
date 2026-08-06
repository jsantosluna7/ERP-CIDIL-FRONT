import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstadosTimelineCacheService {

  private cache = new Map<string, Observable<any>>();

  constructor(private http: HttpClient) {}

  obtenerTodos(url: string): Observable<any[]> {

    if (!this.cache.has(url)) {

      const request$ = this.http.get<any[]>(url).pipe(
        shareReplay(1)
      );

      this.cache.set(url, request$);
    }

    return this.cache.get(url)!;
  }

  obtenerPorId(url: string, id: number): Observable<any> {

    const key = `${url}-${id}`;

    if (!this.cache.has(key)) {

      const request$ = this.http.get<any>(`${url}?id=${id}`).pipe(
        shareReplay(1)
      );

      this.cache.set(key, request$);
    }

    return this.cache.get(key)!;
  }

  limpiarCache() {
    this.cache.clear();
  }
}

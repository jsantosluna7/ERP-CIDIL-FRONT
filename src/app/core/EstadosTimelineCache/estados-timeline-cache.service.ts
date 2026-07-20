import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstadosTimelineCacheService {
  private cache = new Map<number, Observable<any>>();

  constructor(private http: HttpClient) {}

  obtenerTodos(url: string): Observable<any[]> {
    if (!this.cache.has(0)) {
      this.cache.set(0, this.http.get<any[]>(url).pipe(shareReplay(1)));
    }
    return this.cache.get(0)!;
  }

  obtenerPorId(url: string, id: number): Observable<any> {
    if (!this.cache.has(id)) {
      this.cache.set(
        id,
        this.http.get<any>(`${url}?id=${id}`).pipe(shareReplay(1))
      );
    }
    return this.cache.get(id)!;
  }

  limpiarCache() {
    this.cache.clear();
  }
}

import { Injectable } from '@angular/core';
import { TimelineOrden } from '../../interfaces/compras';
import { Observable, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TimelineOrdenCacheService {
  urlPrincipal: string = `${process.env['API_URL']}${process.env['ENDPOINT_ESPECIALIZADO']}`;
  urlTimelineOrden: string = `${process.env['ENDPOINT_ESPECIALIZADO_TIMELINE']}`;

  private cache = new Map<number, Observable<TimelineOrden[]>>();

  constructor(private http: HttpClient) {}

  obtenerPorId(ordenId: number): Observable<TimelineOrden[]> {
    if (!this.cache.has(ordenId)) {
      const req$ = this.http
        .get<TimelineOrden[]>(`${this.urlPrincipal}${ordenId}${this.urlTimelineOrden}`)
        .pipe(shareReplay(1));

      this.cache.set(ordenId, req$);
    }
    return this.cache.get(ordenId)!;
  }

  limpiarCache(ordenId: number) {
    this.cache.delete(ordenId);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CantidadOrdenesCacheService {
  private cache?: {
    data$: Observable<number>;
    expires: number;
  };

  private readonly TTL = 2 * 60 * 1000;
  constructor(private http: HttpClient) {}

  obtenerCantidad(url: string): Observable<number> {
    const now = Date.now();

    if (!this.cache || now > this.cache.expires) {
      this.cache = {
        data$: this.http.get<number>(url).pipe(shareReplay(1)),
        expires: now + this.TTL,
      };
    }

    return this.cache.data$;
  }

  limpiarCache() {
    this.cache = undefined;
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { ItemOrden } from '../../interfaces/compras';

@Injectable({
  providedIn: 'root',
})
export class ItemsOrdenCacheService {
  urlPrincipal: string = `${process.env['API_URL']}${process.env['ENDPOINT_ESPECIALIZADO']}`;
  urlPrincipalItems: string = `${process.env['API_URL']}${process.env['ENDPOINT_ESPECIALIZADO_ITEMS']}`;
  urlItemsOrden: string = `${process.env['ENDPOINT_ESPECIALIZADO_ITEMS_ORDEN']}`;
  urlActualizarOrden: string = `${process.env['ENDPOINT_ACTUALIZAR_ESTADO_ORDEN']}`;
  urlActualizarItem: string = `${process.env['ENDPOINT_ACTUALIZAR_RECEPCION']}`;

  private cache = new Map<number, Observable<ItemOrden[]>>();

  constructor(private http: HttpClient) {}

  obtenerPorId(ordenId: number): Observable<ItemOrden[]> {
    if (!this.cache.has(ordenId)) {
      const req$ = this.http
        .get<ItemOrden[]>(`${this.urlPrincipal}${ordenId}${this.urlItemsOrden}`)
        .pipe(shareReplay(1));

      this.cache.set(ordenId, req$);
    }
    return this.cache.get(ordenId)!;
  }

  limpiarCache(ordenId: number) {
    this.cache.delete(ordenId);
  }
}

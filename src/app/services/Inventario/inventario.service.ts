import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carta, PaginacionResponse } from '../../interfaces/carta';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private apiUrl = `${process.env['API_URL']}${process.env['ENDPOINT_INVENTARIO_EQUIPO']}`;

  constructor(private http: HttpClient) {}

  obtenerCartaPorId(id: number): Observable<Carta> {
  return this.http.get<Carta>(`${this.apiUrl}/${id}`);
}


  getCartas(pagina: number, tamanoPagina: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}?pagina=${pagina}&tamanoPagina=${tamanoPagina}`
    );
  }

  agregarCarta(carta: Carta): Observable<Carta> {
    return this.http.post<Carta>(this.apiUrl, carta);
  }

  actualizarCarta(id: number, carta: Carta): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, carta);
  }

  eliminarCarta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carta, PaginacionResponse } from '../../interfaces/carta';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private apiUrl = `${process.env['API_URL']}${process.env['ENDPOINT_INVENTARIO_EQUIPO']}`;
  private apiUrltodos = `${process.env['API_URL']}${process.env['ENDPOINT_INVENTARIO_EQUIPO_TODOS']}`;
  private apiUrlImpor = `${process.env['API_URL']}${process.env['ENDPOINT_INVENTARIO_EQUIPO_IMPORTAR']}`

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

  //Este apartado es para le exportacion del inventario

   obtenerTodoElInventario() {
    return this.http.get<any[]>(`${this.apiUrltodos}`);
  }

  //Este apartado es para importar el inventario

importarInventarioLote(equipos: any[]) {
  console.log('Voy a enviar:', equipos);
  return this.http.post(this.apiUrlImpor, equipos);  
}

}

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Carta } from "../../interfaces/carta";


@Injectable({
  providedIn: 'root'
})

export class InventarioService {

  private apiUrl = '';

  constructor(private http: HttpClient) { }

  getCartas(): Observable<Carta[]> {
    return this.http.get<Carta[]>(this.apiUrl);

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

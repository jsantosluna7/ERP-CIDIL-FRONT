import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Anuncio,
  CrearAnuncioDTO,
} from '../../interfaces/publicacion.interface';

@Injectable({
  providedIn: 'root',
})
export class PublicacionService {
  private base = `${process.env['API_URL']}`;

  // Endpoints de Anuncios
  private urlAnuncios = `${this.base}${process.env['ENDPOINT_ANUNCIOS']}`;
  private urlCarrusel = `${this.base}${process.env['ENDPOINT_ANUNCIOS_CARRUSEL']}`;
  private urlPasantias = `${this.base}${process.env['ENDPOINT_ANUNCIOS_PASANTIAS']}`;

  constructor(private http: HttpClient) {}

  // ── ANUNCIOS ──────────────────────────────────────────────────────────
  getAnuncios(): Observable<Anuncio[]> {
    return this.http.get<Anuncio[]>(this.urlAnuncios);
  }

  getCarrusel(): Observable<Anuncio[]> {
    return this.http.get<Anuncio[]>(this.urlCarrusel);
  }

  getPasantias(): Observable<Anuncio[]> {
    return this.http.get<Anuncio[]>(this.urlPasantias);
  }

  getAnuncioPorId(id: number): Observable<Anuncio> {
    return this.http.get<Anuncio>(`${this.urlAnuncios}/${id}`);
  }

  crearAnuncio(dto: CrearAnuncioDTO): Observable<Anuncio> {
    return this.http.post<Anuncio>(this.urlAnuncios, dto);
  }

  actualizarAnuncio(id: number, dto: CrearAnuncioDTO): Observable<Anuncio> {
    return this.http.put<Anuncio>(`${this.urlAnuncios}/${id}`, dto);
  }

  eliminarAnuncio(id: number): Observable<any> {
    return this.http.delete(`${this.urlAnuncios}/${id}`);
  }
}

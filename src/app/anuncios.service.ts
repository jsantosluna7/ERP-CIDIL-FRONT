import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Anuncio {
  id?: number;
  titulo: string;
  descripcion: string;
  imagenUrl?: string;
  comentarios?: any[];
  likes?: number;
  esPasantia?: boolean;
  fechaPublicacion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AnuncioService {
  private readonly apiUrl = 'http://localhost:5006/api/Anuncio';

  constructor(private http: HttpClient) {}

  /** 📋 Obtener todos los anuncios */
  obtenerTodos(): Observable<Anuncio[]> {
    return this.http.get<Anuncio[]>(this.apiUrl);
  }

  /** 🔍 Obtener anuncio por ID */
  obtenerPorId(id: number): Observable<Anuncio> {
    return this.http.get<Anuncio>(`${this.apiUrl}/${id}`);
  }

  /** 🟢 Crear anuncio */
  crearAnuncio(formData: FormData): Observable<Anuncio> {
    return this.http.post<Anuncio>(this.apiUrl, formData);
  }

  /** ✏️ Editar anuncio */
  editarAnuncio(id: number, formData: FormData): Observable<Anuncio> {
    return this.http.put<Anuncio>(`${this.apiUrl}/${id}`, formData);
  }

  /** ❌ Eliminar anuncio */
  eliminarAnuncio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /** 📎 Obtener currículums de un anuncio */
  obtenerCurriculums(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/curriculums`);
  }
}
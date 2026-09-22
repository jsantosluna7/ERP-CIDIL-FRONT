import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';

// noticia.model.ts

// Forma cruda que devuelve tu API (Strapi)
export interface NoticiaApiRaw {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  imagen: {
    formats: {
      large?: { url: string };
      medium?: { url: string };
      small?: { url: string };
    };
    url: string; // fallback, tamaño original
  } | null;
}

interface ApiResponse {
  data: NoticiaApiRaw[];
  meta: any;
}

// Forma que consume tu componente/template
export type Categoria = 'IEESL' | 'Tecnología' | 'General';

export interface NoticiaVM {
  id: number;
  foto: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  categoria: Categoria;
}

export type CategoriaFiltro = 'todas' | 'ieesl' | 'tecnologia';

@Injectable({
  providedIn: 'root',
})
export class PublicacionService {
  private apiUrl: string = `${process.env['API_URL']}${process.env['ENDPOINT_NOTICIAS']}`;
  
  constructor(private http: HttpClient) {}

  // Obtener todos los anuncios
  getAnuncios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error al obtener anuncios:', error);
        return of([]);
      }),
    );
  }
}

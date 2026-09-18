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
  private apiUrl: string = `${process.env['API_URL']}${process.env['ENDPOINT_ANUNCIOS']}`;
  // private readonly noticiasApi = 'https://ipl-intranet-backend-production-876157471705.us-east1.run.app/api/seccion-noticias?populate=imagen&populate=portada&pagination%5Bpage%5D=1&pagination%5BpageSize%5D=100';
  private readonly noticiasApi =
    '/api/seccion-noticias?populate=imagen&populate=portada&pagination[page]=1&pagination[pageSize]=100';

  private readonly KW_IEESL = [
    'ieesl',
    'Ieesl',
    'IEESL',
    'instituto especializado de estudios superiores loyola',
    'Instituto Especializado de Estudios Superiores Loyola',
    'Instituto Especializado De Estudios Superiores Loyola',
  ];

  private readonly KW_TECNOLOGIA = [
    'tecnológ',
    'tecnologia',
    'tecnología',
    'innovación',
    'innovacion',
    'startup',
    'digital',
    'robótica',
    'robotica',
    'electrónica',
    'electronica',
    'informática',
    'informatica',
    'steam',
    'prototipo',
    'laboratorio de innovación',
    'ingeniería eléctrica',
    'software',
    'nasa',
    'rover',
  ];

  constructor(private http: HttpClient) {}

  // Obtener todos los anuncios
  getAnuncios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/obtener`).pipe(
      catchError((error) => {
        console.error('Error al obtener anuncios:', error);
        return of([]);
      }),
    );
  }

  // Obtener anuncios en carrusel
  getCarrusel(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/carrusel`).pipe(
      catchError((error) => {
        console.error('Error al obtener carrusel:', error);
        return of([]);
      }),
    );
  }

  // Obtener pasantías
  getPasantias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pasantias`).pipe(
      catchError((error) => {
        console.error('Error al obtener pasantías:', error);
        return of([]);
      }),
    );
  }

  getNoticiasIeeslOTecnologia(): Observable<NoticiaVM[]> {
    return this.http.get<{ data: NoticiaApiRaw[] }>(this.noticiasApi).pipe(
      map((res) =>
        res.data
          .map((n) => this.mapearVM(n))
          .filter((n) => n.categoria !== 'General')
          .sort((a, b) => b.id - a.id),
      ),
    );
  }

  getNoticias(categoria: CategoriaFiltro = 'todas'): Observable<NoticiaVM[]> {
    return this.http.get<{ data: NoticiaApiRaw[] }>(this.noticiasApi).pipe(
      map((res) =>
        res.data
          .map((n) => this.mapearVM(n))
          .filter((n) => {
            if (categoria === 'ieesl') return n.categoria === 'IEESL';
            if (categoria === 'tecnologia') return n.categoria === 'Tecnología';
            return true;
          })
          .sort((a, b) => b.id - a.id),
      ),
    );
  }

  private mapearVM(n: NoticiaApiRaw): NoticiaVM {
    return {
      id: n.id,
      foto: n.imagen?.formats?.large?.url ?? n.imagen?.url ?? '',
      titulo: n.titulo.trim(),
      descripcion: n.descripcion.trim(),
      fecha: n.fecha,
      categoria: this.calcularCategoria(n),
    };
  }

  private calcularCategoria(n: NoticiaApiRaw): Categoria {
    const texto = `${n.titulo} ${n.descripcion}`.toLowerCase();
    if (this.KW_IEESL.some((k) => texto.includes(k))) return 'IEESL';
    if (this.KW_TECNOLOGIA.some((k) => texto.includes(k))) return 'Tecnología';
    return 'General';
  }
}

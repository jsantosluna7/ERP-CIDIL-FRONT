import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

/**
 * 📦 Interfaz de respuesta del backend para el POST de likes
 */
export interface LikeResponse {
  estado: boolean;
  totalLikes: number;
  usuarioDioLike: boolean; // Propiedad necesaria para la lógica del componente
  mensaje?: string;
  anuncioId?: number;
}

/**
 * 📦 Interfaz para contar likes (GET)
 */
export interface ContarLikesResponse {
  totalLikes: number;
  usuarioDioLike: boolean; // Propiedad necesaria para la lógica del componente
  anuncioId?: number;
}

/**
 * 📦 Interfaz para verificar si un usuario ya dio like
 */
export interface ExisteLikeResponse {
  existe: boolean;
  anuncioId?: number;
  usuario?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private readonly apiUrl = 'http://localhost:5006/api/Like';

  // 🎯 CORRECCIÓN CLAVE: Renombrar 'AuthService' a 'authService' para consistencia
  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * 🔑 Genera los headers con token JWT
   */
  private getAuthHeaders(): HttpHeaders {
    // 🎯 Usar la variable inyectada correctamente
    const token = this.authService.getToken(); 
    const headersConfig: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }

    return new HttpHeaders(headersConfig);
  }

  /**
   * ❤️ Da o quita un "like" a un anuncio.
   * El backend detecta automáticamente si debe añadir o quitar.
   */
  darLike(anuncioId: number, usuario: string): Observable<LikeResponse> {
    const body = {
      AnuncioId: anuncioId,
      Usuario: usuario,
    };

    return this.http
      .post<LikeResponse>(this.apiUrl, body, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          // ❌ Se elimina 'alert()' para evitar bloqueos. Se recomienda usar un Toast o Modal.
          console.error('❌ Error al enviar el like:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * 🔢 Cuenta los likes de un anuncio específico y verifica si el usuario autenticado ya dio like.
   */
  contarLikes(anuncioId: number): Observable<ContarLikesResponse> {
    // Se añade un encabezado de autenticación para que el backend pueda verificar el like del usuario actual
    return this.http
      .get<ContarLikesResponse>(`${this.apiUrl}/contar/${anuncioId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          // ❌ Se elimina 'alert()'
          console.error('❌ Error al contar likes:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * 🔍 Verifica si un usuario ya dio like a un anuncio.
   */
  existeLike(
    anuncioId: number,
    correoInstitucional: string
  ): Observable<ExisteLikeResponse> {
    return this.http
      .get<ExisteLikeResponse>(
        `${this.apiUrl}/existe/${anuncioId}/${correoInstitucional}`,
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          console.error(' Error al verificar like:', error);
          return throwError(() => error);
        })
      );
  }
}
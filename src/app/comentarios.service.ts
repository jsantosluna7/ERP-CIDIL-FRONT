import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

/** 🧩 DTO usado para crear un comentario */
export interface ComentarioDTO {
  anuncioId: number;
  usuarioId: number;
  texto: string;
}

/** 📦 Respuesta del backend */
export interface ComentarioRespuesta {
  mensaje: string;
  comentario?: any;
}

@Injectable({
  providedIn: 'root',
})
export class ComentarioService {
  private readonly apiUrl = 'http://localhost:5006/api/Comentario';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /** 🔑 Generar headers con autenticación JWT */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
  }

  /** 📋 Obtener todos los comentarios */
  obtenerTodos(): Observable<any[]> {
    return this.http
      .get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) =>
          this.handleError(error, 'obtener los comentarios')
        )
      );
  }

  /** 💬 Obtener comentarios de un anuncio específico */
  obtenerPorAnuncio(anuncioId: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/anuncio/${anuncioId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) =>
          this.handleError(error, 'obtener los comentarios del anuncio')
        )
      );
  }

  /** 🟢 Crear un nuevo comentario */
  crearComentario(anuncioId: number, texto: string): Observable<ComentarioRespuesta> {
    const usuarioId = this.authService.getUserId();
    const rol = this.authService.getRole();

    // 🛑 Verificar autenticación
    // Nota: Si el ID es numérico y se almacena como string en el token, esta comparación es sensible.
    // Asumimos que getUserId() devuelve un ID numérico o un string que se puede comparar con 0.
    if (!usuarioId || (typeof usuarioId === 'number' && usuarioId <= 0)) {
      return throwError(() => new Error('⚠️ Usuario no autenticado o ID inválido.'));
    }

    // 🧠 Solo permitir Profesor (3) o Estudiante (4)
    if (rol !== '3' && rol !== '4') {
      return throwError(
        () => new Error('🚫 Solo usuarios con rol Profesor o Estudiante pueden comentar.')
      );
    }

    // Aseguramos que usuarioId sea el tipo correcto para ComentarioDTO (asumiendo que es number basado en la lógica del backend)
    const body: ComentarioDTO = { anuncioId, usuarioId: Number(usuarioId), texto }; 
    console.log('📤 Enviando comentario:', body);

    return this.http
      .post<ComentarioRespuesta>(this.apiUrl, body, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => this.handleError(error, 'crear el comentario'))
      );
  }

  /** ❌ Eliminar comentario por ID */
  eliminarComentario(id: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => this.handleError(error, 'eliminar el comentario'))
      );
  }

  /** ⚠️ Manejo centralizado de errores HTTP */
  private handleError(error: any, accion: string): Observable<never> {
    console.error(`❌ Error al ${accion}:`, error);

    const mensaje =
      error.error?.mensaje ||
      error.message ||
      `Error al ${accion}. Intenta nuevamente.`;

    // 🎯 CORRECCIÓN: Reemplazar alert() con console.warn() para evitar el bloqueo del iframe
    if (error.status === 401) {
      console.warn('⚠️ No autorizado: inicia sesión nuevamente.');
    } else if (error.status === 403) {
      console.warn('🚫 No tienes permisos para realizar esta acción.');
    } else if (error.status === 500) {
      console.warn('💥 Error interno del servidor. Intenta más tarde.');
    } else {
      console.warn(`❌ ${mensaje}`);
    }

    return throwError(() => error);
  }
}

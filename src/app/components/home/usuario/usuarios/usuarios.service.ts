import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Usuarios,
  RespuestaUsuarios,
} from '../../../../interfaces/usuarios.interface';
import { HttpClient } from '@angular/common/http';

/**
 * Shape asumido para la respuesta de `obtenerRol()`: array plano de roles
 * con id numérico (1 Superusuario, 2 Administrador, 3 Profesor, 4 Estudiante)
 * y su nombre. AJUSTA los nombres de campo si tu endpoint real usa otros
 * (p.ej. `idRol`/`nombreRol`).
 */
export interface Rol {
  id: number;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = `${process.env['API_URL']}${process.env['ENDPOINT_TODOS_USUARIOS']}`;
  private apiUrlRol = `${process.env['API_URL']}${process.env['ENDPOINT_ROL']}`;
  private apiUrlUsuario = `${process.env['API_URL']}${process.env['ENDPOINT_USUARIO']}`;

  constructor(private http: HttpClient) {}

  getUsuarios(
    endpoint: string,
    pagina: number = 1,
    tamanoPagina: number = 20
  ): Observable<any> {
    return this.http.get(
      `${endpoint}?pagina=${pagina}&tamanoPagina=${tamanoPagina}`
    );
  }

  buscarUsuarios(
    endpoint: string,
    termino: string,
    filtro: string
  ): Observable<any> {
    return this.http.get(`${endpoint}?termino=${termino}&filtro=${filtro}`);
  }

  obtenerUsuarios(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(this.apiUrl);
  }

  obtenerUsuarioId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrlUsuario}/${id}`);
  }

  obtenerUsuariosPag(): Observable<RespuestaUsuarios> {
    return this.http.get<RespuestaUsuarios>(this.apiUrlUsuario);
  }

  obtenerRol(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrlRol);
  }

  obtenerRolId(id: string): Observable<any> {
    return this.http.get(`${this.apiUrlRol}/${id}`);
  }

  cambiarRol(id: number, nuevoRol: number): Observable<any> {
    return this.http.put(`${this.apiUrlUsuario}/${id}`, { nuevoRol });
  }

  /**
   * FIX: antes mandaba `null` como body e ignoraba por completo el parámetro
   * `activo`, así que el backend nunca recibía el nuevo estado. Ahora sí se
   * envía `{ activo }`.
   */
  desactivarUsuario(id: number, activo: boolean): Observable<void> {
    return this.http.patch<void>(`${this.apiUrlUsuario}/${id}`, { activo });
  }

  actualizarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrlUsuario}/${id}`, usuario);
  }

  /**
   * FIX: se amplía el tipo a `number | string` para poder llamarlo
   * indistintamente con el `id` numérico del modelo o con un string,
   * sin tener que castear en cada componente que lo use.
   */
  eliminarUsuario(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrlUsuario}/${id}`);
  }
}
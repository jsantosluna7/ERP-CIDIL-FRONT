import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  Usuarios,
  RespuestaUsuarios,
} from '../../../../interfaces/usuarios.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = `${process.env['API_URL']}${process.env['ENDPOINT_TODOS_USUARIOS']}`;
  private apiUrlRol = `${process.env['API_URL']}${process.env['ENDPOINT_ROL']}`;
  private apiUrlUsuario = `${process.env['API_URL']}${process.env['ENDPOINT_USUARIO']}`;

  constructor(private http: HttpClient) {}

  //private usuarios$ = new BehaviorSubject<Usuarios[]>(this.apiUrl);

    getUsuarios(
    endpoint: string,
    pagina: number = 1,
    tamanoPagina: number = 20
  ): Observable<any> {
    return this.http.get(
      `${endpoint}?pagina=${pagina}&tamanoPagina=${tamanoPagina}`
    );
  }

  buscarUsuarios(endpoint: string, termino: string, filtro:string): Observable<any> {
    return this.http.get(`${endpoint}?termino=${termino}&filtro=${filtro}`);
  }

  obtenerUsuarios(): Observable<RespuestaUsuarios> {
    return this.http.get<RespuestaUsuarios>(this.apiUrl);
  }

  obtenerUsuarioId(id: string): Observable<any> {
    return this.http.get(`${this.apiUrlUsuario}/${id}`);
  }

  obtenerUsuariosPag(): Observable<RespuestaUsuarios> {
    return this.http.get<RespuestaUsuarios>(this.apiUrlUsuario);
  }

  obtenerRol(): Observable<RespuestaUsuarios> {
    return this.http.get<RespuestaUsuarios>(this.apiUrlRol);
  }

  obtenerRolId(id: string): Observable<any> {
    return this.http.get(`${this.apiUrlRol}/${id}`);
  }

  cambiarRol(id: number, nuevoRol: Usuarios['idrol']): Observable<any> {
    return this.http.put(`${this.apiUrlUsuario}/${id}`, { nuevoRol });
  }

  desactivarUsuario(id: number, activo: boolean): Observable<void> {
    return this.http.patch<void>(`${this.apiUrlUsuario}/${id}`, null);
  }

  actualizarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrlUsuario}/${id}`, usuario);
  }

  eliminarUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrlUsuario}/${id}`);
  }

  /*eliminarUsuario(id: number): Observable<boolean> {
  const index = this.apiUrl.findIndex(u => u.id === id);
  if (index !== 1) {
    this.usuarios.splice(index, 1);
    this.usuarios$.next(this.usuarios);
    return of(true);
  }
  return of(false);
}*/

  /* actualizarUsuario(usuarioActualizado: Usuarios) {
    this.usuarios = this.usuarios.map(u =>
      u.id === usuarioActualizado.id ? usuarioActualizado : u
    );
    this.usuarios$.next(this.usuarios);
  }*/

  /*cambiarRol(id: number, nuevoRol: Usuarios['rol']) {
    this.usuarios = this.usuarios.map(u =>
      u.id === id ? { ...u, rol: nuevoRol } : u
    );
    this.usuarios$.next(this.usuarios);
  }*/
}

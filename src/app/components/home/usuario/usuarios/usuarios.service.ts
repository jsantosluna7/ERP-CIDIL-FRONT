import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { Usuarios,RespuestaUsuarios } from "../../../../interfaces/usuarios.interface";
import { HttpClient } from "@angular/common/http";


@Injectable({ providedIn: 'root'})

export class UsuarioService{

   private apiUrl = `${process.env['API_URL']}${process.env['ENDPOINT_USUARIO']}`;
   private apiUrlRol = `${process.env['API_URL']}${process.env['ENDPOINT_ROL']}`;

     constructor(private http: HttpClient) {}

    //private usuarios$ = new BehaviorSubject<Usuarios[]>(this.apiUrl);


    obtenerUsuarios(): Observable<RespuestaUsuarios> {
    return this.http.get<RespuestaUsuarios>(this.apiUrl);
   }
  
   obtenerRol(): Observable<RespuestaUsuarios>{
    return this.http.get<RespuestaUsuarios>(this.apiUrlRol)
   }

   obtenerRolId(id:string): Observable<any>{
    return this.http.get(`${this.apiUrlRol}/${id}`)
   }

   cambiarRol(id: number, nuevoRol: Usuarios['idrol']): Observable<any> {
    return this.http.put(`${this.apiUrlRol}/${id}`,{nuevoRol});
   }


  eliminarUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
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
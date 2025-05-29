import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Usuarios } from "../../../../interfaces/usuarios.interface";


@Injectable({ providedIn: 'root'})

export class UsuarioService{

    private usuarios: Usuarios[] =[
        {id:1, nombre:'Jean Carlos',apellido:'Mendez' , matricula:10081908, email:'jean@mail.com',telefono:'856566556',direccion:'esa misma',rol:'Administrador'},
        {id:2, nombre:'Jean Carlos',apellido:'Mendez' , matricula:10081908, email:'jean@mail.com',telefono:'856566556',direccion:'esa misma',rol:'Administrador'},
    ];

    private usuarios$ = new BehaviorSubject<Usuarios[]>(this.usuarios);


    obtenerUsuarios() {
    return this.usuarios$.asObservable();
  }

  eliminarUsuario(id: number) {
    this.usuarios = this.usuarios.filter(u => u.id !== id);
    this.usuarios$.next(this.usuarios);
  }

  actualizarUsuario(usuarioActualizado: Usuarios) {
    this.usuarios = this.usuarios.map(u =>
      u.id === usuarioActualizado.id ? usuarioActualizado : u
    );
    this.usuarios$.next(this.usuarios);
  }

  cambiarRol(id: number, nuevoRol: Usuarios['rol']) {
    this.usuarios = this.usuarios.map(u =>
      u.id === id ? { ...u, rol: nuevoRol } : u
    );
    this.usuarios$.next(this.usuarios);
  }




}
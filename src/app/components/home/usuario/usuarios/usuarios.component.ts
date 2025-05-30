import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../../../interfaces/usuarios.interface';
import { UsuarioService } from './usuarios.service';

@Component({
  selector: 'app-usuarios',
  imports: [],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuarios[] = [];

  constructor(private usuarioService: UsuarioService){}

  ngOnInit(){
    this.usuarioService.obtenerUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }

    eliminar(id: number) {
    this.usuarioService.eliminarUsuario(id);
  }



    cambiarRol(usuario: Usuarios) {
    const nuevoRol = prompt('Nuevo rol (Administrador,Estudiante, Super Usuario):', usuario.rol);
    if (nuevoRol === 'Administrador' || nuevoRol === 'Estudiante' || nuevoRol === 'Super Usuario') {
      this.usuarioService.cambiarRol(usuario.id, nuevoRol);
    } else {
      alert('Rol inválido');
    }
  }

}

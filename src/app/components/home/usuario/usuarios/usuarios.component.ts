import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLocationDot, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { Usuarios } from '../../../../interfaces/usuarios.interface';
import { UsuarioService } from './usuarios.service';

@Component({
  selector: 'app-usuarios',
  imports: [FontAwesomeModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {

 faUser = faUser;
 faLocationDot = faLocationDot;
 faPhone = faPhone;
 faEnvelope = faEnvelope;

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

  editar(usuario: Usuarios) {
    const nombre = prompt('Nuevo nombre:', usuario.nombre);
    if (nombre) {
      this.usuarioService.actualizarUsuario({ ...usuario, nombre });
    }
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

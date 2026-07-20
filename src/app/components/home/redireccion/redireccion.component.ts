import { Component } from '@angular/core';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redireccion',
  imports: [],
  templateUrl: './redireccion.component.html',
  styleUrl: './redireccion.component.css',
})
export class RedireccionComponent {
  constructor(private _usuarios: UsuariosService, private router: Router) {
    const rol = Number(this._usuarios.userSubject.value?.idRol);
    switch (rol) {
      case 1: // Superusuario
        this.router.navigate(['/home/dashboard']);
        break;
      case 2: // Admin
        this.router.navigate(['/home/dashboard']);
        break;
      case 3: // Profesor
        this.router.navigate(['/home/calendario']);
        break;
      case 4: // Estudiante
        this.router.navigate(['/home/calendario']);
        break;
      default:
        this.router.navigate(['/no-autorizado']);
    }
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuariosService } from '../../services/Api/Usuarios/usuarios.service';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private _usuario: UsuariosService, private router: Router) {}

  canActivate(): boolean {
    if (this._usuario.isAuthenticated()) {
      this.router.navigate(['/acceso/home']); // Redirige a donde quieras
      return false;
    }
    return true;
  }
}

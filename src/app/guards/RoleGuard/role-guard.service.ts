import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { UsuariosService } from '../../services/Api/Usuarios/usuarios.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private _usuario: UsuariosService, private _router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles: number[] = route.data['roles'];
    const user = this._usuario.userSubject.value;

    if (user && expectedRoles.includes(Number(user.idRol))) {
      return true;
    }

    // Opcional: redirigir o mostrar mensaje
    this._router.navigate(['/horario']); // Crea una vista para esto si quieres
    return false;
  }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UsuariosService } from '../../services/Api/Usuarios/usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _usuario: UsuariosService, private _router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    if (this._usuario.isAuthenticated()) return true;
    this._router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}

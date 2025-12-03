import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    TitleCasePipe,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  nombreUsuarioLogueado: string | null = null;
  rolActual: string = 'EXTERNO';

  // Flags de rol
  esSuperUsuario = false;
  esAdmin = false;
  esProfesor = false;
  esEstudiante = false;
  esPersonalCidil = false;
  esExterno = true;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario(): void {
    if (!this.authService.isAuthenticated()) {
      this.resetFlags();
      this.nombreUsuarioLogueado = null;
      this.rolActual = 'EXTERNO';
      return;
    }

    // Nombre mostrado
    this.nombreUsuarioLogueado =
      (this.authService.getUserName && this.authService.getUserName()) ||
      (this.authService.getEmail && this.authService.getEmail()) ||
      'Usuario';

    // Rol
    const rolRaw = (this.authService.getRole && this.authService.getRole())?.toString().toUpperCase() ?? 'EXTERNO';
    this.rolActual = rolRaw;

    this.esSuperUsuario   = rolRaw === 'SUPERUSUARIO' || rolRaw === '1';
    this.esAdmin          = rolRaw === 'ADMINISTRADOR' || rolRaw === '2';
    this.esProfesor       = rolRaw === 'PROFESOR' || rolRaw === '3';
    this.esEstudiante     = rolRaw === 'ESTUDIANTE' || rolRaw === '4';
    this.esPersonalCidil  = rolRaw === 'PERSONALCIDIL' || rolRaw === '5';

    this.esExterno = !(
      this.esSuperUsuario ||
      this.esAdmin ||
      this.esProfesor ||
      this.esEstudiante ||
      this.esPersonalCidil
    );
  }

  resetFlags(): void {
    this.esSuperUsuario = false;
    this.esAdmin = false;
    this.esProfesor = false;
    this.esEstudiante = false;
    this.esPersonalCidil = false;
    this.esExterno = true;
  }

  // Permisos
  puedeVerDashboard(): boolean {
    return this.authService.isAuthenticated();
  }

  puedePublicar(): boolean {
    return this.esSuperUsuario || this.esAdmin || this.esPersonalCidil;
  }

  puedeEditar(): boolean {
    return this.puedePublicar();
  }

  puedeVerCurriculos(): boolean {
    return this.esSuperUsuario || this.esAdmin || this.esPersonalCidil;
  }

  puedeSubirCurriculo(): boolean {
    return this.esProfesor || this.esEstudiante || this.esExterno;
  }

  puedeComentarYDarLike(): boolean {
    return this.esProfesor || this.esEstudiante;
  }

  // Navegación
  navigateToDashboard(): void {
    if (!this.authService.isAuthenticated()) {
      console.warn('Intento de acceder al dashboard sin estar logueado.');
      return;
    }

    const rol = (this.authService.getRole && this.authService.getRole())?.toString().toUpperCase() ?? '';

    let targetRoute = '/home/dashboard';

    if (rol === 'PROFESOR' || rol === '3' || rol === 'ESTUDIANTE' || rol === '4') {
      targetRoute = '/home/calendario';
    }

    this.router.navigate([targetRoute]).catch(err => {
      console.error('Error navegando al dashboard desde Header:', err);
    });
  }

  navegarLogin(): void {
    this.router.navigate(['/auth/login']).catch(err => {
      console.error('Error navegando a login:', err);
    });
  }

  cerrarSesion(): void {
    if (this.authService.logout) {
      this.authService.logout();
    } else {
      localStorage.clear();
      sessionStorage.clear();
    }

    this.resetFlags();
    this.nombreUsuarioLogueado = null;
    this.rolActual = 'EXTERNO';

    this.router.navigate(['/anuncio']).catch(err => {
      console.error('Error al navegar luego de logout:', err);
    });
  }
}

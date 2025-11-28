import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common'; // TitleCasePipe importado
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header', 
  standalone: true,
  imports: [
    CommonModule, 
    TitleCasePipe,     // 👈 Correcto: Importado para usar | titlecase
    RouterModule       
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css' 
})
export class HeaderComponent implements OnInit {
  
  nombreUsuarioLogueado: string | null = null;
  rolActual: string | null = null;
  
  constructor(public authService: AuthService, private router: Router) {}
  
  ngOnInit(): void {
    this.cargarDatosUsuario();
    // Es recomendable si tu servicio maneja cambios de estado en tiempo real
    // Ejemplo: this.authService.authChanged$.subscribe(() => this.cargarDatosUsuario());
  }

  cargarDatosUsuario(): void {
    if (this.authService.isAuthenticated()) {
      // ✅ FUNCIONARÁ AHORA: Llamando al método recién agregado
      this.nombreUsuarioLogueado = this.authService.getUserName();
      this.rolActual = this.authService.getRole();
    } else {
      this.nombreUsuarioLogueado = null;
      this.rolActual = null;
    }
  }

  // --- MÉTODOS DE NAVEGACIÓN Y PERMISOS ---
  
  puedeVerDashboard(): boolean {
    const rol = this.authService.getRole();
    if (!rol) return false;
    // Roles 1 (SuperUser) y 2 (Admin)
    return rol === '1' || rol === '2'; 
  }
  
  navigateToDashboard(): void {
    this.router.navigate(['/home/dashboard']);
  }

  navegarLogin(): void {
    this.router.navigate(['/auth/login']);
  }
  
  cerrarSesion(): void {
    this.authService.logout();
    this.cargarDatosUsuario(); 
    this.router.navigate(['/anuncio']);
  }
}
/**
 * Archivo de rutas principal de la aplicación.
 * Aquí se definen todas las rutas, sus componentes asociados, y los guards de acceso.
 */

import { Routes } from '@angular/router';
import { AuthGuard } from './guards/AuthGuard/auth-guard.service';
import { NoAuthGuard } from './guards/NoAuthGuard/no-auth-guard.service';
import { RoleGuard } from './guards/RoleGuard/role-guard.service';

export const routes: Routes = [
  /**
   * Rutas públicas accesibles solo para usuarios NO autenticados
   * Layout: login-layout.component
   */
  {
    path: '',
    loadComponent: () =>
      import('./components/inicio-sesion/login-layout/login-layout.component')
        .then((m) => m.LoginLayoutComponent),
    canActivate: [NoAuthGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./components/inicio-sesion/login/login.component')
            .then((m) => m.LoginComponent),
      },
      {
        path: 'registrar',
        loadComponent: () =>
          import('./components/inicio-sesion/registro/registro.component')
            .then((m) => m.RegistroComponent),
      },
      {
        path: 'recuperar-contrasena',
        loadComponent: () =>
          import('./components/inicio-sesion/recuperar-contrasena/recuperar-contrasena.component')
            .then((m) => m.RecuperarContrasenaComponent),
      },
      {
        path: 'cambiar-contrasena',
        loadComponent: () =>
          import('./components/inicio-sesion/cambiar-contrasena/cambiar-contrasena.component')
            .then((m) => m.CambiarContrasenaComponent),
      },
    ],
  },

  /**
   * Rutas protegidas para usuarios autenticados
   * Layout: home/layout.component
   */
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/layout/layout.component')
        .then((m) => m.LayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/home/redireccion/redireccion.component')
            .then((m) => m.RedireccionComponent),
      },

      /** Dashboard accesible solo para roles 1 y 2 */
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/home/dashboard/dashboard.component')
            .then((m) => m.DashboardComponent),
        canActivate: [RoleGuard],
        data: { roles: [1, 2] },
      },

      /** Calendario accesible para roles 1, 3 y 4 */
      {
        path: 'calendario',
        loadComponent: () =>
          import('./components/home/calendario-home/calendario-home.component')
            .then((m) => m.CalendarioHomeComponent),
        canActivate: [RoleGuard],
        data: { roles: [1, 3, 4] },
      },

      { // Reserva de laboratorios sin restricciones de roles
        path: 'reserva-laboratorio',
        loadComponent: () =>
          import('./components/home/reserva-laboratorio/reserva-laboratorio.component')
            .then((m) => m.ReservaLaboratorioComponent),
      },

      { // Inventario sin restricción de roles
        path: 'inventario',
        loadComponent: () =>
          import('./components/home/inventario/inventario.component')
            .then((m) => m.InventarioComponent),
      },

      /**
       * Sección de horarios accesible solo a roles 1 y 2
       * Incluye ruta para errores en horarios
       */
      {
        path: 'horario',
        canActivate: [RoleGuard],
        data: { roles: [1, 2] },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./components/home/horario/horario.component')
                .then((m) => m.HorarioComponent),
          },
          {
            path: 'errores',
            loadComponent: () =>
              import('./components/elements/error-list/error-list.component')
                .then((m) => m.ErrorListComponent),
          },
        ],
      },

      /** Carrito de equipos o materiales */
      {
        path: 'carrito',
        loadComponent: () =>
          import('./components/home/carrito/carrito.component')
            .then((m) => m.CarritoComponent),
        children: [
          { path: '', redirectTo: 'carrito', pathMatch: 'full' },
        ],
      },

      /** Reserva de equipos (sin restricción de roles) */
      {
        path: 'reserva-equipo',
        loadComponent: () =>
          import('./components/home/reserva-equipo/reserva-equipo.component')
            .then((m) => m.ReservaEquipoComponent),
      },

      /**
       * Módulo de gestión de usuarios: roles 1 y 2
       * Incluye listado y modificación
       */
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./components/home/usuario/layout-usuarios/layout-usuarios.component')
            .then((m) => m.LayoutUsuariosComponent),
        canActivate: [RoleGuard],
        data: { roles: [1, 2] },
        children: [
          { path: '', redirectTo: 'listado-usuarios', pathMatch: 'full' },
          {
            path: 'listado-usuarios',
            loadComponent: () =>
              import('./components/home/usuario/usuarios/usuarios.component')
                .then((m) => m.UsuariosComponent),
          },
          {
            path: 'modificar-usuario',
            loadComponent: () =>
              import('./components/home/usuario/modificar-usuario/modificar-usuario.component')
                .then((m) => m.ModificarUsuarioComponent),
          },
        ],
      },

      /** Solicitudes de laboratorio y equipos (roles 1 y 2) */
      {
        path: 'solicitud-laboratorio',
        loadComponent: () =>
          import('./components/home/solicitud-reserva-laboratorio/solicitud-reserva-laboratorio.component')
            .then((m) => m.SolicitudReservaLaboratorioComponent),
        canActivate: [RoleGuard],
        data: { roles: [1, 2] },
      },
      {
        path: 'solicitud-equipo',
        loadComponent: () =>
          import('./components/home/solicitud-reserva-equipo/solicitud-reserva-equipo.component')
            .then((m) => m.SolicitudReservaEquipoComponent),
        canActivate: [RoleGuard],
        data: { roles: [1, 2] },
      },

      /** Módulo IoT (roles 1 y 2) */
      {
        path: 'iot',
        loadComponent: () =>
          import('./components/home/IoT/iot.component')
            .then((m) => m.IotComponent),
        canActivate: [RoleGuard],
        data: { roles: [1, 2] },
      },

      /** Creación de laboratorios y equipos (roles 1 y 2) */
      {
        path: 'crear-laboratorio',
        loadComponent: () =>
          import('./components/home/crear-laboratorio/crear-laboratorio.component')
            .then((m) => m.CrearLaboratorioComponent),
        canActivate: [RoleGuard],
        data: { roles: [1, 2] },
      },
      {
        path: 'crear-equipo',
        loadComponent: () =>
          import('./components/home/crear-equipo/crear-equipo.component')
            .then((m) => m.CrearEquipoComponent),
        canActivate: [RoleGuard],
        data: { roles: [1, 2] },
      },

      /** Reportes: accesible a roles 1, 2 y 3 */
      {
        path: 'reportes',
        loadComponent: () =>
          import('./components/home/reportes/reportes.component')
            .then((m) => m.ReportesComponent),
        canActivate: [RoleGuard],
        data: { roles: [1, 2, 3] },
      },
      {
        path: 'vista-reportes',
        loadComponent: () =>
          import('./components/home/vista-reportes/vista-reportes.component')
            .then((m) => m.VistaReportesComponent),
        canActivate: [RoleGuard],
        data: { roles: [1, 2, 3] },
      },
    ],
  },

  /** Ruta comodín: cualquier otra URL redirige a login */
  {
    path: '**',
    redirectTo: 'login',
  },
];

import { Routes } from '@angular/router';
import { AuthGuard } from './guards/AuthGuard/auth-guard.service';
import { NoAuthGuard } from './guards/NoAuthGuard/no-auth-guard.service';
import { RoleGuard } from './guards/RoleGuard/role-guard.service';

export const routes: Routes = [
   {
        path: '',
        loadComponent: () => import('./components/inicio-sesion/login-layout/login-layout.component').then(m => m.LoginLayoutComponent),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./components/home/horario/horario.component').then(
                (m) => m.HorarioComponent
              ),
          },
          {
            path: 'errores',
            loadComponent: () =>
              import(
                './components/elements/error-list/error-list.component'
              ).then((m) => m.ErrorListComponent),
          },
        ],
        canActivate: [RoleGuard],
        data: { roles: [1, 2] },
      },
      {
        path: 'carrito',
        loadComponent: () =>
          import('./components/home/carrito/carrito.component').then(
            (m) => m.CarritoComponent
          ),
        children: [{ path: '', redirectTo: 'carrito', pathMatch: 'full' }],
      },
      {
        path: 'reserva-equipo',
        loadComponent: () =>
          import(
            './components/home/reserva-equipo/reserva-equipo.component'
          ).then((m) => m.ReservaEquipoComponent),
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import(
            './components/home/usuario/layout-usuarios/layout-usuarios.component'
          ).then((m) => m.LayoutUsuariosComponent),
        canActivate: [RoleGuard],
        data: { roles: [1, 2] },
        children: [
          { path: '', redirectTo: 'listado-usuarios', pathMatch: 'full' },
          {
            path: 'listado-usuarios',
            loadComponent: () =>
              import(
                './components/home/usuario/usuarios/usuarios.component'
              ).then((m) => m.UsuariosComponent),
          },
          {
            path: 'modificar-usuario',
            loadComponent: () =>
              import(
                './components/home/usuario/modificar-usuario/modificar-usuario.component'
              ).then((m) => m.ModificarUsuarioComponent),
          },
        ],
      },
      {
        path: 'crear-laboratorio',
        loadComponent: () =>
          import(
            './components/home/crear-laboratorio/crear-laboratorio.component'
          ).then((m) => m.CrearLaboratorioComponent),
      },
      {
        path: 'crear-equipo',
        loadComponent: () =>
          import('./components/home/crear-equipo/crear-equipo.component').then(
            (m) => m.CrearEquipoComponent
          ),
      },
      {
        path: 'iot',
        loadComponent: () =>
          import('./components/home/IoT/iot.component').then(
            (m) => m.IotComponent
          ),
        canActivate: [RoleGuard],
        data: { roles: [1, 2] },
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

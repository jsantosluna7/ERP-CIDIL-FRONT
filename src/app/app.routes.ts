import { Routes } from '@angular/router';
import { AuthGuard } from './guards/AuthGuard/auth-guard.service';
import { NoAuthGuard } from './guards/NoAuthGuard/no-auth-guard.service';
import { RoleGuard } from './guards/RoleGuard/role-guard.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './components/inicio-sesion/login-layout/login-layout.component'
      ).then((m) => m.LoginLayoutComponent),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./components/inicio-sesion/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'registrar',
        loadComponent: () =>
          import('./components/inicio-sesion/registro/registro.component').then(
            (m) => m.RegistroComponent
          ),
      },
      {
        path: 'recuperar-contrasena',
        loadComponent: () =>
          import(
            './components/inicio-sesion/recuperar-contrasena/recuperar-contrasena.component'
          ).then((m) => m.RecuperarContrasenaComponent),
      },
      {
        path: 'cambiar-contrasena',
        loadComponent: () =>
          import(
            './components/inicio-sesion/cambiar-contrasena/cambiar-contrasena.component'
          ).then((m) => m.CambiarContrasenaComponent),
      },
    ],
    canActivate: [NoAuthGuard],
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/layout/layout.component').then(
        (m) => m.LayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/home/redireccion/redireccion.component').then(
            (m) => m.RedireccionComponent
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/home/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        canActivate: [RoleGuard],
        data: { roles: [1, 2] },
      },
      {
        path: 'calendario',
        loadComponent: () =>
          import(
            './components/home/dashboard/all-widget/calendario/calendario.component'
          ).then((m) => m.CalendarioComponent),
        canActivate: [RoleGuard],
        data: { roles: [1, 3, 4] },
      },
      {
        path: 'reserva-laboratorio',
        loadComponent: () =>
          import(
            './components/home/reserva-laboratorio/reserva-laboratorio.component'
          ).then((m) => m.ReservaLaboratorioComponent),
      },
      {
        path: 'inventario',
        loadComponent: () =>
          import('./components/home/inventario/inventario.component').then(
            (m) => m.InventarioComponent
          ),
      },
      {
        path: 'horario',
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
  {
    path: '',
    loadComponent: () =>
      import(
        './components/inicio-sesion/login-layout/login-layout.component'
      ).then((m) => m.LoginLayoutComponent),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./components/inicio-sesion/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'registrar',
        loadComponent: () =>
          import('./components/inicio-sesion/registro/registro.component').then(
            (m) => m.RegistroComponent
          ),
      },
      {
        path: 'recuperar-contrasena',
        loadComponent: () =>
          import(
            './components/inicio-sesion/recuperar-contrasena/recuperar-contrasena.component'
          ).then((m) => m.RecuperarContrasenaComponent),
      },
      {
        path: 'cambiar-contrasena',
        loadComponent: () =>
          import(
            './components/inicio-sesion/cambiar-contrasena/cambiar-contrasena.component'
          ).then((m) => m.CambiarContrasenaComponent),
      },
    ],
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/layout/layout.component').then(
        (m) => m.LayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/home/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'reserva-laboratorio',
        loadComponent: () =>
          import(
            './components/home/reserva-laboratorio/reserva-laboratorio.component'
          ).then((m) => m.ReservaLaboratorioComponent),
      },
      {
        path: 'inventario',
        loadComponent: () =>
          import('./components/home/inventario/inventario.component').then(
            (m) => m.InventarioComponent
          ),
      },
      {
        path: 'horario',
        loadComponent: () =>
          import('./components/home/horario/horario.component').then(
            (m) => m.HorarioComponent
          ),
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
        path: 'solicitud-laboratorio',
        loadComponent: () =>
          import(
            './components/home/solicitud-reserva-laboratorio/solicitud-reserva-laboratorio.component'
          ).then((m) => m.SolicitudReservaLaboratorioComponent),
      },
      {
        path: 'solicitud-equipo',
        loadComponent: () =>
          import(
            './components/home/solicitud-reserva-equipo/solicitud-reserva-equipo.component'
          ).then((m) => m.SolicitudReservaEquipoComponent),
      },
      {
        path: 'iot',
        loadComponent: () =>
          import('./components/home/IoT/iot.component').then(
            (m) => m.IotComponent,
            {path: 'crear-laboratorio', loadComponent: () => import('./components/home/crear-laboratorio/crear-laboratorio.component').then(m => m.CrearLaboratorioComponent)},
            {path: 'crear-equipo', loadComponent: () => import('./components/home/crear-equipo/crear-equipo.component').then(m => m.CrearEquipoComponent)}

          ),
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

/**
 * Archivo principal de rutas del sistema ERP-CIDIL
 *
 * ✅ Flujo de Redirección: Login -> /redireccion -> /home/inventario (Ruta Común)
 * ✅ Lógica de Rol: La vista principal se decide mediante el botón de navegación (HomeComponent)
 */

import { Routes } from '@angular/router';
import { AuthGuard } from './guards/AuthGuard/auth-guard.service';
import { NoAuthGuard } from './guards/NoAuthGuard/no-auth-guard.service';
import { RoleGuard } from './guards/RoleGuard/role-guard.service';

export const routes: Routes = [
    // ----------------------------------------------------
    //  RUTAS PÚBLICAS EXTERNAS (VISITANTES)
    // ----------------------------------------------------
    {
        path: '',
        redirectTo: 'anuncio',
        pathMatch: 'full',
    },
    {
        path: 'anuncio',
        // 👈 ESTE ES EL CAMBIO CLAVE: Carga el AnunciosComponent
        loadComponent: () =>
            import('./anuncios/anuncios.component').then((m) => m.AnunciosComponent),
        title: 'Anuncios Públicos | ERP CIDIL',
    },

    // 🌟 NUEVA RUTA PÚBLICA PARA SOBRE CIDIL
    {
        path: 'sobre-cidil',
        loadComponent: () =>
            import('./pages/sobre-cidil/sobre-cidil.component').then(
                (m) => m.SobreCidilComponent
            ),
        title: 'Sobre CIDIL | ERP CIDIL',
    },

    {
        path: 'error-acceso',
        loadComponent: () =>
            import('./components/elements/error-list/error-list.component').then(
                (m) => m.ErrorListComponent
            ),
        title: 'Acceso Denegado',
    },

    // Acceso directo a /login (redirige a /auth/login)
    { 
        path: 'login', 
        redirectTo: 'auth/login', 
        pathMatch: 'full' 
    },

    // ----------------------------------------------------
    // 🔐 LOGIN / REGISTRO (Protegidas por NoAuthGuard)
    // ----------------------------------------------------
    {
        path: 'auth',
        loadComponent: () =>
            import('./components/inicio-sesion/login-layout/login-layout.component').then(
                (m) => m.LoginLayoutComponent
            ),
        canActivate: [NoAuthGuard],
        children: [
            {
                path: 'login',
                loadComponent: () => import('./components/inicio-sesion/login/login.component').then((m) => m.LoginComponent),
                title: 'Iniciar Sesión | ERP CIDIL',
            },
            {
                path: 'registrar',
                loadComponent: () => import('./components/inicio-sesion/registro/registro.component').then((m) => m.RegistroComponent),
                title: 'Registro | ERP CIDIL',
            },
            {
                path: 'recuperar-contrasena',
                loadComponent: () => import('./components/inicio-sesion/recuperar-contrasena/recuperar-contrasena.component').then((m) => m.RecuperarContrasenaComponent),
                title: 'Recuperar Contraseña | ERP CIDIL',
            },
            {
                path: 'verificacion-otp',
                loadComponent: () => import('./components/inicio-sesion/verificacion-otp/verificacion-otp.component').then((m) => m.VerificacionOtpComponent),
                canActivate: [AuthGuard], 
                title: 'Verificación OTP | ERP CIDIL',
            },
            {
                path: 'cambiar-contrasena',
                loadComponent: () => import('./components/inicio-sesion/cambiar-contrasena/cambiar-contrasena.component').then((m) => m.CambiarContrasenaComponent),
                canActivate: [AuthGuard], 
                title: 'Cambiar Contraseña | ERP CIDIL',
            },
        ],
    },

    // ----------------------------------------------------
    // 🧭 PUNTO DE REDIRECCIÓN INTERMEDIO
    // ----------------------------------------------------
    {
        path: 'redireccion',
        loadComponent: () =>
            import('./components/home/redireccion/redireccion.component').then(
                (m) => m.RedireccionComponent
            ),
        title: 'Redirección | ERP CIDIL',
        canActivate: [AuthGuard],
    },

    // ----------------------------------------------------
    // 🏢 RUTAS INTERNAS (PROTEGIDAS)
    // ----------------------------------------------------
    {
        path: 'home',
        loadComponent: () =>
            import('./components/home/layout/layout.component').then((m) => m.LayoutComponent),
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: '/redireccion', pathMatch: 'full' },

            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./components/home/dashboard/dashboard.component').then((m) => m.DashboardComponent),
                canActivate: [RoleGuard],
                data: { roles: [1, 2] },
            },

            {
                path: 'calendario',
                loadComponent: () =>
                    import('./components/home/calendario-home/calendario-home.component').then((m) => m.CalendarioHomeComponent),
                canActivate: [RoleGuard],
                data: { roles: [1, 3, 4] },
            },

            {
                path: 'inventario',
                loadComponent: () => import('./components/home/inventario/inventario.component').then((m) => m.InventarioComponent),
            },
            
            {
                path: 'reserva-laboratorio',
                loadComponent: () => import('./components/home/reserva-laboratorio/reserva-laboratorio.component').then((m) => m.ReservaLaboratorioComponent),
            },
            {
                path: 'horario',
                canActivate: [RoleGuard],
                data: { roles: [1, 2] },
                children: [
                    { path: '', loadComponent: () => import('./components/home/horario/horario.component').then((m) => m.HorarioComponent) },
                    { path: 'errores', loadComponent: () => import('./components/elements/error-list/error-list.component').then((m) => m.ErrorListComponent) },
                ],
            },
            { path: 'carrito', loadComponent: () => import('./components/home/carrito/carrito.component').then((m) => m.CarritoComponent) },
            { path: 'reserva-equipo', loadComponent: () => import('./components/home/reserva-equipo/reserva-equipo.component').then((m) => m.ReservaEquipoComponent) },
            {
                path: 'usuarios',
                loadComponent: () => import('./components/home/usuario/layout-usuarios/layout-usuarios.component').then((m) => m.LayoutUsuariosComponent),
                canActivate: [RoleGuard],
                data: { roles: [1, 2] },
                children: [
                    { path: '', redirectTo: 'listado-usuarios', pathMatch: 'full' },
                    { path: 'listado-usuarios', loadComponent: () => import('./components/home/usuario/usuarios/usuarios.component').then((m) => m.UsuariosComponent) },
                    { path: 'modificar-usuario', loadComponent: () => import('./components/home/usuario/modificar-usuario/modificar-usuario.component').then((m) => m.ModificarUsuarioComponent) },
                ],
            },
            { path: 'solicitud-laboratorio', loadComponent: () => import('./components/home/solicitud-reserva-laboratorio/solicitud-reserva-laboratorio.component').then((m) => m.SolicitudReservaLaboratorioComponent), canActivate: [RoleGuard], data: { roles: [1, 2] } },
            { path: 'solicitud-equipo', loadComponent: () => import('./components/home/solicitud-reserva-equipo/solicitud-reserva-equipo.component').then((m) => m.SolicitudReservaEquipoComponent), canActivate: [RoleGuard], data: { roles: [1, 2] } },
            { path: 'iot', loadComponent: () => import('./components/home/IoT/iot.component').then((m) => m.IotComponent), canActivate: [RoleGuard], data: { roles: [1, 2] } },
            { path: 'crear-laboratorio', loadComponent: () => import('./components/home/crear-laboratorio/crear-laboratorio.component').then((m) => m.CrearLaboratorioComponent), canActivate: [RoleGuard], data: { roles: [1, 2] } },
            { path: 'crear-equipo', loadComponent: () => import('./components/home/crear-equipo/crear-equipo.component').then((m) => m.CrearEquipoComponent), canActivate: [RoleGuard], data: { roles: [1, 2] } },
            { path: 'reportes', loadComponent: () => import('./components/home/reportes/reportes.component').then((m) => m.ReportesComponent), canActivate: [RoleGuard], data: { roles: [1, 2, 3] } },
            { path: 'vista-reportes', loadComponent: () => import('./components/home/vista-reportes/vista-reportes.component').then((m) => m.VistaReportesComponent), canActivate: [RoleGuard], data: { roles: [1, 2, 3] } },
        ],
    },

    // ----------------------------------------------------
    //  RUTA COMODÍN (404)
    // ----------------------------------------------------
    { path: '**', redirectTo: 'anuncio' },
];
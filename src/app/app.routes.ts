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
        loadComponent: () =>
            import('./components/home/home.component').then((m) => m.HomeComponent),
        title: 'Anuncios Públicos | ERP CIDIL',
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
            // Las siguientes rutas requieren AuthGuard o AuthGuardOtp para asegurar el contexto
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
        canActivate: [AuthGuard], // Asegura que solo usuarios autenticados pasen por aquí
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
            // 🔁 La ruta base /home ahora redirige al componente intermedio
            { path: '', redirectTo: '/redireccion', pathMatch: 'full' }, 

            // 👑 DASHBOARD DE GESTIÓN: ACCESO SOLO PARA ROLES 1 Y 2 (Revertido)
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./components/home/dashboard/dashboard.component').then((m) => m.DashboardComponent),
                canActivate: [RoleGuard],
                data: { roles: [1, 2] }, 
            },

            // 🎓 CALENDARIO: VISTA PRINCIPAL PARA PROFESORES/ESTUDIANTES
            {
                path: 'calendario',
                loadComponent: () =>
                    import('./components/home/calendario-home/calendario-home.component').then((m) => m.CalendarioHomeComponent),
                canActivate: [RoleGuard],
                data: { roles: [1, 3, 4] },
            },

            // 📋 INVENTARIO: RUTA COMÚN DE INICIO (Debe ser el destino de RedireccionComponent)
            {
                path: 'inventario',
                loadComponent: () => import('./components/home/inventario/inventario.component').then((m) => m.InventarioComponent),
                // No tiene RoleGuard en data, asumiendo que es accesible para todos o que el guardia es general.
            },
            
            // --- Resto de Rutas (Mantenidas sin cambios) ---
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
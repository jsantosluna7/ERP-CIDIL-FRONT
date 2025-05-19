import { Routes } from '@angular/router';

export const routes: Routes = [
    {path:'', redirectTo: 'home/login', pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./components/inicio-sesion/login-layout/login-layout.component').then(m => m.LoginLayoutComponent),
        children: [
            {path: 'login', loadComponent: () => import('./components/inicio-sesion/login/login.component').then(m => m.LoginComponent)},
            {path: 'registrar', loadComponent: () => import('./components/inicio-sesion/registro/registro.component').then(m => m.RegistroComponent)},
            {path: 'recuperar-contrasena', loadComponent: () => import('./components/inicio-sesion/recuperar-contrasena/recuperar-contrasena.component').then(m => m.RecuperarContrasenaComponent)},
            {path: 'cambiar-contrasena/:token', loadComponent: () => import('./components/inicio-sesion/cambiar-contrasena/cambiar-contrasena.component').then(m => m.CambiarContrasenaComponent)},
        ],
    }
];

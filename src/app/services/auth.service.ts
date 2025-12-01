import { Injectable } from '@angular/core';

// Definición básica de la interfaz de usuario (ajusta los campos si es necesario)
export interface Usuario {
    id: number;
    nombre: string; // Nombre completo del usuario
    correoInstitucional: string;
    idRol: number; // Por ejemplo, 3 para Profesor, 4 para Estudiante
    token: string;
    nombreUsuario: string; // Nombre corto de usuario (si existe)
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly storageKey = 'usuario';

    constructor() {}

    /**
     * ✅ NUEVO MÉTODO: Obtiene el objeto completo del usuario desde localStorage.
     * Útil para llenar la información de la interfaz de usuario.
     */
    obtenerUsuarioActual(): Usuario | null {
        try {
            const storedUser = localStorage.getItem(this.storageKey);
            if (storedUser) {
                return JSON.parse(storedUser) as Usuario;
            }
            return null;
        } catch {
            return null;
        }
    }
    
    /**
     * 🧑‍💻 Obtiene el nombre del usuario para mostrar en el Header.
     * 🟢 MODIFICADO: Devuelve el nombre completo o nombre de usuario COMPLETO.
     */
    getUserName(): string | null {
        try {
            const storedUser = this.obtenerUsuarioActual();
            
            // 1. Intentar obtener de la interfaz Usuario (nombre de usuario o nombre completo)
            if (storedUser) {
                // 1.1 Priorizar el nombre de usuario (nombre corto) si existe
                if (storedUser.nombreUsuario) {
                    console.log('✅ getUserName: Nombre de usuario (corto) obtenido del storage:', storedUser.nombreUsuario);
                    return storedUser.nombreUsuario;
                }
                // 1.2 Si no hay nombre de usuario, usar el nombre completo
                if (storedUser.nombre) {
                    // **AQUÍ HEMOS ELIMINADO EL .split(' ')[0] para devolver el nombre completo.**
                    console.log('✅ getUserName: Nombre completo obtenido del storage:', storedUser.nombre);
                    return storedUser.nombre;
                }
            }

            // 2. Fallback: Intentar decodificar el token para buscar el nombre
            const token = this.getToken();
            if (token) {
                const payload = this.decodeToken(token);
                // Buscar posibles claves de nombre
                const name = payload?.name || payload?.username || payload?.nombreCompleto;
                if (name) {
                    console.log('✅ getUserName: Nombre obtenido del token:', name.toString());
                    return name.toString();
                }
            }

            console.warn('⚠️ getUserName: Nombre de usuario no encontrado.');
            return null;
        } catch (e) {
            console.error('❌ getUserName: Error al obtener el nombre', e);
            return null;
        }
    }


    // 🔑 Obtiene el token JWT desde localStorage o desde el objeto guardado
    getToken(): string | null {
        try {
            const storedUser = localStorage.getItem(this.storageKey);

            if (storedUser) {
                const user = JSON.parse(storedUser);
                return (
                    user?.token ||
                    user?.Token ||
                    user?.TokenId ||
                    user?.tokenString ||
                    localStorage.getItem('token') ||
                    null
                );
            }

            return localStorage.getItem('token');
        } catch {
            return null;
        }
    }

    // 🧩 Decodifica el JWT
    private decodeToken(token: string): any {
        try {
            const payload = token.split('.')[1];
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(atob(base64));
        } catch {
            console.error('❌ Error al decodificar el token');
            return null;
        }
    }

    // 🧠 Obtiene el rol del usuario (Ej: 4 = Estudiante, 3 = Profesor)
    getRole(): string {
        try {
            const token = this.getToken();
            if (token) {
                const payload = this.decodeToken(token);
                const idRol = payload?.idRol;

                if (idRol) {
                    console.log('✅ getRole: Rol obtenido del token:', idRol.toString());
                    return idRol.toString(); // Devuelve directamente el ID del rol
                }
            }

            // Si no está en el token, intenta buscar en localStorage
            const storedUser = localStorage.getItem(this.storageKey);
            if (storedUser) {
                const user = JSON.parse(storedUser);
                if (user?.idRol) {
                    console.log('✅ getRole: Rol obtenido del storage:', user.idRol);
                    return user.idRol.toString();
                }
            }

            console.warn('⚠️ getRole: Rol no encontrado. Devolviendo EXTERNO.');
            return 'EXTERNO';
        } catch (e) {
            console.error('❌ getRole: Error obteniendo el rol', e);
            return 'EXTERNO';
        }
    }

    // 🆔 Obtiene el ID del usuario autenticado (usa "sub" o "id")
    getUserId(): number | null {
        try {
            const token = this.getToken();
            if (token) {
                const payload = this.decodeToken(token);
                const id =
                    payload?.sub ||
                    payload?.id ||
                    payload?.userId ||
                    payload?.usuarioId ||
                    payload?.idUsuario;

                if (id && !isNaN(Number(id))) {
                    console.log('✅ getUserId (Token):', Number(id));
                    return Number(id);
                }
            }

            // Buscar en storage si no está en el token
            const storedUser = localStorage.getItem(this.storageKey);
            if (storedUser) {
                const user = JSON.parse(storedUser);
                if (user?.id) return Number(user.id);
            }

            console.warn('⚠️ getUserId: No encontrado');
            return null;
        } catch (e) {
            console.error('❌ getUserId: Error al obtener el ID', e);
            return null;
        }
    }

    /**
     * 📧 Obtiene el correo institucional del usuario
     * 🟢 AJUSTADO: Se eliminó la impresión de consola duplicada.
     */
    getEmail(): string | null {
        try {
            // 1. Buscar en el Token
            const token = this.getToken();
            if (token) {
                const payload = this.decodeToken(token);
                const email =
                    payload?.correoInstitucional ||
                    payload?.email ||
                    payload?.correo ||
                    null;

                if (email) {
                    // Eliminamos el console.log duplicado aquí.
                    console.log('✅ getEmail (Token):', email.toString()); 
                    return email.toString();
                }
            }

            // 2. Si no está en el token, busca en localStorage
            const storedUser = localStorage.getItem(this.storageKey);
            if (storedUser) {
                const user = JSON.parse(storedUser);
                const emailFromStorage = user?.correoInstitucional || user?.email || null;
                if (emailFromStorage) {
                    console.log('✅ getEmail (Storage):', emailFromStorage);
                    return emailFromStorage;
                }
            }

            console.warn('⚠️ getEmail: Correo no encontrado.');
            return null;
        } catch {
            return null;
        }
    }

    // ✅ Verifica si el token es válido
    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        const payload = this.decodeToken(token);
        if (!payload) return false;

        if (!payload.exp) return true; // Sin expiración definida

        const expirationDate = new Date(payload.exp * 1000);
        return expirationDate > new Date();
    }

    // 🚪 Cierra sesión
    logout(): void {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem('token');
    }
}
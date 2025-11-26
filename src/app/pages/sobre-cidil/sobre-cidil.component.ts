import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 

// Definiciones e interfaces para Firebase (asumiendo que las librerías están cargadas globalmente)
declare function initializeApp(config: any): any;
declare function getAuth(app?: any): any;
declare function onAuthStateChanged(auth: any, callback: (user: User | null) => void): () => void;
declare function signOut(auth: any): Promise<void>;
declare function signInAnonymously(auth: any): Promise<any>;
declare function signInWithCustomToken(auth: any, token: string): Promise<any>;

// Variables globales del entorno
declare const __firebase_config: string;
declare const __initial_auth_token: string | undefined;
declare const __app_id: string;

// Interfaz mínima para el usuario de Firebase
interface User {
  uid: string;
}

@Component({
  selector: 'app-sobre-cidil',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './sobre-cidil.component.html',
  styleUrls: ['./sobre-cidil.component.css']
})
export class SobreCidilComponent implements OnInit {

  // Propiedades del Header y Autenticación
  estaAutenticado: boolean = false;
  nombreUsuarioLogueado: string = 'Invitado';
  rolActual: string = 'invitado'; 
  usuarioId: string | null = null;
  private auth: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.initializeAndAuthenticate();
  }

  /**
   * Inicializa Firebase y establece el listener de autenticación.
   */
  private async initializeAndAuthenticate(): Promise<void> {
    try {
      // 1. Inicializar la App de Firebase (si no se ha hecho)
      // Usamos el config global proporcionado por el entorno
      const firebaseConfig = JSON.parse(__firebase_config);
      let app: any;
      
      // Intentamos inicializar si no existe una instancia global (para evitar errores de re-inicialización)
      try {
        app = initializeApp(firebaseConfig);
      } catch (e) {
        // Esto captura si ya está inicializada, que es común en entornos Angular
        console.warn("Firebase app may have been initialized elsewhere.", e);
        // Si ya está inicializada, getAuth() la encontrará
      }

      // 2. Obtener la instancia de Auth
      this.auth = getAuth(app); 

      // 3. Autenticación Inicial
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        // Usar token de autenticación personalizado
        await signInWithCustomToken(this.auth, __initial_auth_token);
      } else {
        // Si no hay token, iniciar sesión anónimamente
        await signInAnonymously(this.auth);
      }
      
      // 4. Establecer el Listener de Autenticación
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          this.handleAuthenticatedUser(user);
        } else {
          this.handleUnauthenticatedUser();
        }
      });

    } catch (error) {
      console.error("Error crítico en la inicialización o autenticación de Firebase:", error);
      // Opcional: Mostrar un mensaje de error en la UI si la inicialización falla
    }
  }

  /**
   * Maneja el estado cuando un usuario está autenticado.
   * @param user El objeto User de Firebase.
   */
  private handleAuthenticatedUser(user: User): void {
    this.estaAutenticado = true;
    this.usuarioId = user.uid;
    
    // Lógica para determinar el rol basada en el UID (debe ser consistente)
    // Usamos el UID para determinar si es 'admin' o 'estudiante'
    if (this.usuarioId.includes('admin')) {
      this.rolActual = 'administrador';
      this.nombreUsuarioLogueado = 'Admin CIDIL';
    } else {
      this.rolActual = 'estudiante';
      this.nombreUsuarioLogueado = 'Estudiante'; 
    }
  }

  /**
   * Maneja el estado cuando el usuario no está autenticado.
   */
  private handleUnauthenticatedUser(): void {
    this.estaAutenticado = false;
    this.usuarioId = null;
    this.nombreUsuarioLogueado = 'Invitado';
    this.rolActual = 'invitado';
  }

  // Funciones de Permisos y Navegación (para la barra superior)

  puedeVerDashboard(): boolean {
    return this.rolActual === 'administrador';
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  navegarLogin(): void {
    this.router.navigate(['/login']);
  }

  cerrarSesion(): void {
    signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
  }
}
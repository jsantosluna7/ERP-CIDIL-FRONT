import { Component, AfterViewInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './header/header.component';
import { createChat } from '@n8n/chat';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  
  mostrarHeader: boolean = false; // Valor inicial a falso por seguridad

  /**
   * ✅ LISTA BLANCA: Rutas donde el Header DEBE aparecer.
   * Esto anula la necesidad de listar todas las rutas internas y de autenticación.
   * Usamos 'anuncio' y 'sobre-cidil' como rutas base.
   */
  private rutasVisibles: string[] = [
    '/anuncio',
    '/sobre-cidil',
    // Si la ruta principal ('/') también debe mostrar el header:
    // '/',
  ];

  urlLia: string =
    'https://lia.cidilipl.online/webhook/a889d2ae-2159-402f-b326-5f61e90f602e/chat';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd))
      .subscribe((evento: NavigationEnd) => {
        this.verificarRuta(evento.urlAfterRedirects);
      });
  }

  verificarRuta(url: string) {
    // Verifica si la URL actual comienza con alguna de las rutas visibles.
    // Esto cubre rutas como /anuncio/id o /sobre-cidil?param=x
    this.mostrarHeader = this.rutasVisibles.some(ruta => url.startsWith(ruta));
  }

  ngAfterViewInit(): void {
    createChat({
      webhookUrl: this.urlLia,
      webhookConfig: { method: 'POST' },
      target: '#n8n-chat',
      mode: 'window',
      chatInputKey: 'chatInput',
      showWelcomeScreen: false,
      defaultLanguage: 'en',
      initialMessages: [
        '¡Hola! 👋',
        'Mi nombre es LIA. ¿Cómo puedo ayudarte hoy?',
      ],
      i18n: {
        en: {
          title: '¡Bienvenido/a! 👋',
          subtitle: '',
          footer: '',
          getStarted: 'Nueva Conversación',
          inputPlaceholder: 'Haz tu pregunta..',
          closeButtonTooltip: 'true',
        },
      },
    });
  }
}
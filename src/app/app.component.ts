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
  
  mostrarHeader = true;

  // Rutas donde NO debe aparecer el header
  private rutasOcultas = [
    '/auth/login',
    '/auth/registrar',
    '/auth/recuperar-contrasena',
    '/auth/verificacion-otp',
    '/auth/cambiar-contrasena',
    '/login', // por si entran directo
    '/home/dashboard', // si también quieres ocultarlo aquí
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
    // Revisa si la ruta actual está en la lista de rutas ocultas
    this.mostrarHeader = !this.rutasOcultas.includes(url);
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

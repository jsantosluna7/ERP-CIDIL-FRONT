import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { createChat } from '@n8n/chat';

@Component({
  selector: 'app-login-layout',
  imports: [RouterOutlet],
  templateUrl: './login-layout.component.html',
  styleUrl: './login-layout.component.css',
})
export class LoginLayoutComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    createChat({
      webhookUrl:
        'http://10.122.120.87:8765/webhook/a889d2ae-2159-402f-b326-5f61e90f602e/chat',
      webhookConfig: {
        method: 'POST',
      },
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

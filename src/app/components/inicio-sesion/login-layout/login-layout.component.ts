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

  urlLia: string = `${process.env['CHATBOT_LIA_URL']}`;
  
  ngAfterViewInit(): void {
    createChat({
      webhookUrl:
        this.urlLia,
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

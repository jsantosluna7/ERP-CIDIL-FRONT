import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReservaLaboratorioComponent } from './components/home/reserva-laboratorio/reserva-laboratorio.component';
import { createChat } from '@n8n/chat';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit  {
  title = 'ERP-CIDIL-FRONT';

  // urlLia: string = `${process.env['CHATBOT_LIA_URL']}`;

  urlLia: string =
    'https://lia.cidilipl.online/webhook/a889d2ae-2159-402f-b326-5f61e90f602e/chat';

  ngAfterViewInit(): void {
    createChat({
      webhookUrl: this.urlLia,
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

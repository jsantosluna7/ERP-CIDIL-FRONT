import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../elements/sidebar/sidebar.component';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { createChat } from '@n8n/chat';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements AfterViewInit {
  isSidebarClosed = false;

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

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

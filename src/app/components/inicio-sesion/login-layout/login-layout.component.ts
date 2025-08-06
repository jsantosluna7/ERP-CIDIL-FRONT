import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { createChat } from '@n8n/chat';

@Component({
  selector: 'app-login-layout',
  imports: [RouterOutlet],
  templateUrl: './login-layout.component.html',
  styleUrl: './login-layout.component.css',
})
export class LoginLayoutComponent {}

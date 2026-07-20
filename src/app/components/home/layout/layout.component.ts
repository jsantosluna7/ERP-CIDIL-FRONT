import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../elements/sidebar/sidebar.component';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { createChat } from '@n8n/chat';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent {
  isSidebarClosed = false;

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }
}

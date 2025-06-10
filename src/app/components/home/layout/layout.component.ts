import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../../elements/sidebar/sidebar.component";
import { NavbarComponent } from "../../elements/navbar/navbar.component";

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  isSidebarClosed = true;

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }
}

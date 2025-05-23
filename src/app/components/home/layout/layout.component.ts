import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../../elements/navbar/navbar.component";

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  isSidebarClosed = true;

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }
}

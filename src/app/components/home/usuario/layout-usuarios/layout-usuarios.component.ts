import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-usuarios',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './layout-usuarios.component.html',
  styleUrl: './layout-usuarios.component.css'
})
export class LayoutUsuariosComponent {

}

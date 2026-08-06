import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortalModule } from '@angular/cdk/portal';
import { ModalStateService } from './modal-state.service';

@Component({
  selector: 'app-modales-globales',
  standalone: true,
  imports: [CommonModule, FormsModule, PortalModule],
  templateUrl: './modales-globales.component.html',
  styleUrls: ['./modales-globales.component.css']
})
export class ModalesGlobalesComponent {
  modal = inject(ModalStateService);
}
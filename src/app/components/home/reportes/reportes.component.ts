import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-reporte-falla',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css',
})
export class ReportesComponent {
  private readonly fb = inject(FormBuilder);

  /** Límite de caracteres para la descripción, usado también en el template */
  readonly descripcionMaxLength = 400;

  /** Controla la visibilidad (y el reinicio de la animación) del toast de confirmación */
  readonly mostrarToast = signal(false);

  reporteForm = this.fb.nonNullable.group({
    categoria: ['Infraestructura', Validators.required],
    lugar: ['', Validators.required],
    descripcion: [
      '',
      [Validators.required, Validators.maxLength(this.descripcionMaxLength)],
    ],
  });

  enviarReporte(): void {
    if (this.reporteForm.invalid) {
      this.reporteForm.markAllAsTouched();
      return;
    }

    // Aquí iría la llamada al servicio correspondiente, por ejemplo:
    // this.fallasService.crear(this.reporteForm.getRawValue()).subscribe(...)
    console.log('Reporte enviado:', this.reporteForm.getRawValue());

    // Reinicia la animación del toast aunque ya esté visible de un envío anterior
    this.mostrarToast.set(false);
    setTimeout(() => this.mostrarToast.set(true));

    this.reporteForm.reset({
      categoria: 'Infraestructura',
      lugar: '',
      descripcion: '',
    });
  }
}

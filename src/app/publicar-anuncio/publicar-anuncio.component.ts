import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AnuncioService, Anuncio } from '../anuncios.service';

@Component({
  selector: 'app-publicar-anuncio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publicar-anuncio.component.html',
  styleUrls: ['./publicar-anuncio.component.css']
})
export class PublicarAnuncioComponent {
  titulo = '';
  descripcion = '';
  esPasantia = false;
  fechaPublicacion = '';
  archivo: File | null = null;
  cargando = false;

  constructor(private anuncioService: AnuncioService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.archivo = input.files?.[0] ?? null;
  }

  publicar() {
    if (!this.titulo || !this.descripcion || !this.fechaPublicacion) {
      alert('Completa todos los campos');
      return;
    }

    this.cargando = true;

    const formData = new FormData();
    formData.append('titulo', this.titulo);
    formData.append('descripcion', this.descripcion);
    formData.append('esPasantia', String(this.esPasantia));
    formData.append('fechaPublicacion', this.fechaPublicacion);

    if (this.archivo) formData.append('imagen', this.archivo);

    this.anuncioService.crearAnuncio(formData).subscribe({
      next: (res: Anuncio) => {
        console.log('Anuncio publicado:', res);
        alert('Anuncio publicado con éxito');
        this.limpiarFormulario();
      },
      error: (err) => {
        console.error('Error al publicar anuncio:', err);
        alert('Error al publicar anuncio');
      },
      complete: () => {
        this.cargando = false;
      }
    });
  }

  limpiarFormulario() {
    this.titulo = '';
    this.descripcion = '';
    this.esPasantia = false;
    this.fechaPublicacion = '';
    this.archivo = null;
  }
}

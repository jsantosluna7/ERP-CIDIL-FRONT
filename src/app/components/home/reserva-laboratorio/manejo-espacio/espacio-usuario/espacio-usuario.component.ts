import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DetalleSolicitudUsuario, ModalStateService } from '../../../../elements/modales-globales/modal-state.service';
import { Router } from '@angular/router';

export interface SolicitudUsuario {
  id: string;
  titulo: string;
  imagen: string;
  fecha: string;
  personas: number;
  ubicacion: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  enviadaEl: string;
  motivo: string;
  motivoRechazo?: string;
  aprobadaEl?: string;
  mensajeEstado: string;
}

@Component({
  selector: 'app-mis-solicitudes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './espacio-usuario.component.html',
  styleUrls: ['./espacio-usuario.component.css']
})
export class EspacioUsuarioComponent {

  private modalSvc = inject(ModalStateService);

  constructor(private router: Router) {}

  filtroActivo = signal<string>('todos');
  tabActivo    = signal<'espacios' | 'equipos'>('espacios');

  solicitudes = signal<SolicitudUsuario[]>([
    {
      id: 'SOL-2025-001',
      titulo: 'Laboratorio de Cómputo A',
      imagen: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=200&fit=crop',
      fecha: 'Vie 07 Mar 2025 · 10:00 – 14:00',
      personas: 25,
      ubicacion: 'Piso 2',
      estado: 'pendiente',
      enviadaEl: 'Enviada hace 2 horas',
      motivo: 'Taller de programación introductoria para estudiantes de primer año de Ingeniería en Sistemas.',
      mensajeEstado: 'Tu solicitud está siendo revisada por el administrador. Recibirás una notificación cuando sea procesada.'
    },
    {
      id: 'SOL-2025-003',
      titulo: 'Sala de Reuniones Ejecutiva',
      imagen: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop',
      fecha: 'Mar 04 Mar 2025 · 09:00 – 11:00',
      personas: 10,
      ubicacion: 'Piso 3',
      estado: 'aprobada',
      aprobadaEl: '02 Mar 2025',
      enviadaEl: 'Enviada el 01 Mar 2025',
      motivo: 'Reunión de coordinación académica con jefes de departamento y dirección general.',
      mensajeEstado: 'Tu reserva fue aprobada el 02 Mar 2025. El espacio estará disponible en la fecha y hora indicadas.'
    },
    {
      id: 'SOL-2025-004',
      titulo: 'Aula Magna',
      imagen: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=200&h=200&fit=crop',
      fecha: 'Dom 02 Mar 2025 · 18:00 – 22:00',
      personas: 150,
      ubicacion: 'Planta Baja',
      estado: 'rechazada',
      motivoRechazo: 'El espacio no está disponible los domingos. Por favor selecciona una fecha entre lunes y sábado.',
      enviadaEl: 'Enviada el 28 Feb 2025',
      motivo: 'Evento de gala para celebración de fin de año estudiantil con presentaciones artísticas.',
      mensajeEstado: 'El espacio no está disponible los domingos. Por favor selecciona una fecha entre lunes y sábado dentro del horario permitido.'
    },
    {
      id: 'SOL-2025-005',
      titulo: 'Laboratorio de Cómputo B',
      imagen: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200&h=200&fit=crop',
      fecha: 'Jue 13 Mar 2025 · 16:00 – 20:00',
      personas: 20,
      ubicacion: 'Piso 2',
      estado: 'pendiente',
      enviadaEl: 'Enviada hace 1 día',
      motivo: 'Práctica de laboratorio de base de datos, asignatura Sistemas de Información II.',
      mensajeEstado: 'Tu solicitud está siendo revisada por el administrador. Recibirás una notificación cuando sea procesada.'
    }
  ]);

  solicitudesFiltradas = computed(() =>
    this.solicitudes().filter(s =>
      this.filtroActivo() === 'todos' || s.estado === this.filtroActivo()
    )
  );

  conteo = computed(() => ({
    todos:     this.solicitudes().length,
    pendiente: this.solicitudes().filter(s => s.estado === 'pendiente').length,
    aprobada:  this.solicitudes().filter(s => s.estado === 'aprobada').length,
    rechazada: this.solicitudes().filter(s => s.estado === 'rechazada').length,
  }));

  filtrar(estado: string): void {
    this.filtroActivo.set(estado);
  }

  cancelar(id: string): void {
    this.solicitudes.update(list => list.filter(s => s.id !== id));
  }

  abrirDetalle(s: SolicitudUsuario): void {
    const data: DetalleSolicitudUsuario = {
      id:            s.id,
      espacio:       s.titulo,
      fecha:         s.fecha,
      personas:      s.personas,
      ubicacion:     s.ubicacion,
      estado:        s.estado,
      motivo:        s.motivo,
      enviadaEl:     s.enviadaEl,
      motivoRechazo: s.motivoRechazo,
      aprobadaEl:    s.aprobadaEl,
    };
    this.modalSvc.abrirDetalleUsuario(data);
  }

  irPrincipal() {
    this.router.navigate(['/home/reserva-laboratorio']);
  }
}
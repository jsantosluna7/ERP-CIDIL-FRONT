import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetalleSolicitud, ModalStateService } from '../../elements/modales-globales/modal-state.service';

export interface Solicitud {
  id: string;
  titulo: string;
  imagen: string;
  solicitante: string;
  fecha: string;
  personas: number;
  motivo: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  accionTexto?: string;
}

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitud-reserva-laboratorio.component.html',
  styleUrls: ['./solicitud-reserva-laboratorio.component.css']
})
export class SolicitudReservaLaboratorioComponent {

  private modalSvc = inject(ModalStateService);

  filtroEstado = signal<string>('todos');
  busqueda     = signal<string>('');
  tabActivo    = signal<'espacios' | 'equipos'>('espacios');

  private detalles: Record<string, Omit<DetalleSolicitud, 'id' | 'estado'>> = {
    'SOL-2025-001': {
      espacio: 'Laboratorio de Cómputo A', solicitante: 'María García',
      departamento: 'Ingeniería en Sistemas', fechaHora: 'Vie 07 Mar 2025 · 10:00 – 14:00',
      duracion: '4 horas', personas: 25,
      motivo: 'Taller de programación introductoria para estudiantes de primer año.',
      aprobadoPor: 'Pendiente de aprobación'
    },
    'SOL-2025-002': {
      espacio: 'Sala de Conferencias Principal', solicitante: 'Carlos Méndez',
      departamento: 'Dirección Académica', fechaHora: 'Lun 10 Mar 2025 · 14:00 – 17:00',
      duracion: '3 horas', personas: 60,
      motivo: 'Conferencia magistral sobre innovación tecnológica con ponente invitado.',
      aprobadoPor: 'Pendiente de aprobación'
    },
    'SOL-2025-003': {
      espacio: 'Sala de Reuniones Ejecutiva', solicitante: 'Ana Rodríguez',
      departamento: 'Coordinación Académica', fechaHora: 'Mar 04 Mar 2025 · 09:00 – 11:00',
      duracion: '2 horas', personas: 10,
      motivo: 'Reunión de coordinación académica con jefes de departamento.',
      aprobadoPor: 'Admin — Juan Pérez'
    },
    'SOL-2025-004': {
      espacio: 'Aula Magna', solicitante: 'Luis Torres',
      departamento: 'Bienestar Estudiantil', fechaHora: 'Dom 02 Mar 2025 · 18:00 – 22:00',
      duracion: '4 horas', personas: 150,
      motivo: 'Evento de gala para celebración de fin de año estudiantil.',
      aprobadoPor: 'Admin — Juan Pérez'
    },
    'SOL-2025-005': {
      espacio: 'Laboratorio de Cómputo B', solicitante: 'Sofia Núñez',
      departamento: 'Sistemas de Información', fechaHora: 'Jue 13 Mar 2025 · 16:00 – 20:00',
      duracion: '4 horas', personas: 20,
      motivo: 'Práctica de laboratorio de base de datos, asignatura Sistemas de Información II.',
      aprobadoPor: 'Pendiente de aprobación'
    }
  };

  solicitudes = signal<Solicitud[]>([
    { id:'SOL-2025-001', titulo:'Laboratorio de Cómputo A',
      imagen:'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=200&fit=crop',
      solicitante:'María García', fecha:'Vie 07 Mar 2025 · 10:00 – 14:00',
      personas:25, motivo:'Taller de programación introductoria para estudiantes de primer año.',
      estado:'pendiente' },
    { id:'SOL-2025-002', titulo:'Sala de Conferencias Principal',
      imagen:'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=200&h=200&fit=crop',
      solicitante:'Carlos Méndez', fecha:'Lun 10 Mar 2025 · 14:00 – 17:00',
      personas:60, motivo:'Conferencia magistral sobre innovación tecnológica.',
      estado:'pendiente' },
    { id:'SOL-2025-003', titulo:'Sala de Reuniones Ejecutiva',
      imagen:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop',
      solicitante:'Ana Rodríguez', fecha:'Mar 04 Mar 2025 · 09:00 – 11:00',
      personas:10, motivo:'Reunión de coordinación académica.',
      estado:'aprobada', accionTexto:'Aprobada el 02 Mar 2025' },
    { id:'SOL-2025-004', titulo:'Aula Magna',
      imagen:'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=200&h=200&fit=crop',
      solicitante:'Luis Torres', fecha:'Dom 02 Mar 2025 · 18:00 – 22:00',
      personas:150, motivo:'Evento de gala para celebración de fin de año.',
      estado:'rechazada', accionTexto:'Rechazada · No se atiende domingos' },
    { id:'SOL-2025-005', titulo:'Laboratorio de Cómputo B',
      imagen:'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200&h=200&fit=crop',
      solicitante:'Sofia Núñez', fecha:'Jue 13 Mar 2025 · 16:00 – 20:00',
      personas:20, motivo:'Práctica de laboratorio de base de datos.',
      estado:'pendiente' }
  ]);

  solicitudesFiltradas = computed(() => {
    const t = this.busqueda().toLowerCase();
    return this.solicitudes().filter(s => {
      const estado   = this.filtroEstado() === 'todos' || s.estado === this.filtroEstado();
      const busqueda = !t || s.titulo.toLowerCase().includes(t)
                          || s.solicitante.toLowerCase().includes(t)
                          || s.id.toLowerCase().includes(t);
      return estado && busqueda;
    });
  });

  total      = computed(() => this.solicitudes().length);
  pendientes = computed(() => this.solicitudes().filter(s => s.estado === 'pendiente').length);
  aprobadas  = computed(() => this.solicitudes().filter(s => s.estado === 'aprobada').length);
  rechazadas = computed(() => this.solicitudes().filter(s => s.estado === 'rechazada').length);

  aprobar(id: string): void {
    this.solicitudes.update(list =>
      list.map(s => s.id === id
        ? { ...s, estado: 'aprobada' as const, accionTexto: 'Aprobada ahora' }
        : s)
    );
  }

  abrirModal(id: string): void {
    this.modalSvc.abrirRechazo(id, (motivo) => {
      const resumen = motivo.length > 40 ? motivo.substring(0, 40) + '…' : motivo;
      this.solicitudes.update(list =>
        list.map(s => s.id === id
          ? { ...s, estado: 'rechazada' as const, accionTexto: `Rechazada · ${resumen}` }
          : s)
      );
    });
  }

  abrirDetalle(id: string): void {
    const det = this.detalles[id];
    const sol = this.solicitudes().find(s => s.id === id);
    if (!det || !sol) return;
    this.modalSvc.abrirDetalle({ ...det, id, estado: sol.estado });
  }
}
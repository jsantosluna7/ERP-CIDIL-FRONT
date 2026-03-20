import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  DetalleSolicitudUsuario,
  ModalStateService,
} from '../../../../elements/modales-globales/modal-state.service';
import { Router } from '@angular/router';
import { SolicitudReservaEspacioCacheService } from '../../../../../core/SolicitudReservaEspacioCache/solicitud-reserva-espacio-cache.service';

export interface SolicitudApiUsuario {
  id: number;
  idEstado: number;
  idLaboratorio: number;
  idUsuario: number;
  idUsuarioAprobador: number;
  nombreEspacio: string;
  nombreEstado: string;
  tipoRegistro: string;
  motivo: string;
  personasCantidad: number;
  fechaSolicitud: string;
  fechaInicio: string;
  fechaFinal: string;
  fechaAprobacion: string;
  horaInicio: string;
  horaFinal: string;
  comentarioAprobacion: string;
  imagenLaboratorio: string | null;
}

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
  styleUrls: ['./espacio-usuario.component.css'],
})
export class EspacioUsuarioComponent implements OnInit {
  private modalSvc = inject(ModalStateService);

  constructor(
    private router: Router,
    private solicitudSvc: SolicitudReservaEspacioCacheService,
  ) {}

  filtroActivo = signal<string>('todos');
  tabActivo = signal<'espacios' | 'equipos'>('espacios');
  solicitudes = signal<SolicitudUsuario[]>([]);

  // ── Loading states ──────────────────────────────────────────
  /** true mientras se carga/recarga la lista */
  cargando = signal(false);
  /** id de la solicitud que se está cancelando */
  cancelandoId = signal<string | null>(null);
  // ────────────────────────────────────────────────────────────

  solicitudesFiltradas = computed(() =>
    this.solicitudes().filter(
      (s) => this.filtroActivo() === 'todos' || s.estado === this.filtroActivo(),
    ),
  );

  conteo = computed(() => ({
    todos:     this.solicitudes().length,
    pendiente: this.solicitudes().filter((s) => s.estado === 'pendiente').length,
    aprobada:  this.solicitudes().filter((s) => s.estado === 'aprobada').length,
    rechazada: this.solicitudes().filter((s) => s.estado === 'rechazada').length,
  }));

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  filtrar(estado: string): void {
    this.filtroActivo.set(estado);
  }

  cancelar(id: string): void {
    if (this.cancelandoId() === id) return;

    this.cancelandoId.set(id);

    this.solicitudSvc.cancelarSolicitud(Number(id)).subscribe({
      next: () => {
        this.cancelandoId.set(null);
        this.cargarSolicitudes();
      },
      error: (err) => {
        console.error('Error al cancelar solicitud:', err);
        this.cancelandoId.set(null);
      },
    });
  }

  abrirDetalle(s: SolicitudUsuario): void {
    const data: DetalleSolicitudUsuario = {
      id: s.id,
      espacio: s.titulo,
      fecha: s.fecha,
      personas: s.personas,
      ubicacion: s.ubicacion,
      estado: s.estado,
      motivo: s.motivo,
      enviadaEl: s.enviadaEl,
      motivoRechazo: s.motivoRechazo,
      aprobadaEl: s.aprobadaEl,
    };
    this.modalSvc.abrirDetalleUsuario(data);
  }

  irPrincipal(): void {
    this.router.navigate(['/home/reserva-laboratorio']);
  }

  private mapearEstado(idEstado: number): 'pendiente' | 'aprobada' | 'rechazada' {
    const map: Record<number, 'pendiente' | 'aprobada' | 'rechazada'> = {
      1: 'aprobada',
      2: 'pendiente',
      3: 'rechazada',
    };
    return map[idEstado] ?? 'pendiente';
  }

  private formatearHora(hora: string): string {
    const [h, m] = hora.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
  }

  private buildMensajeEstado(item: SolicitudApiUsuario): string {
    switch (item.idEstado) {
      case 1:
        return `Tu reserva fue aprobada por <strong>${item.comentarioAprobacion ?? 'el administrador'}</strong>.`;
      case 3:
        return `Tu solicitud fue rechazada. Motivo: <strong>${item.comentarioAprobacion ?? 'sin especificar'}</strong>.`;
      default:
        return 'Tu solicitud está siendo revisada por el administrador.';
    }
  }

  private mapearSolicitud(item: SolicitudApiUsuario): SolicitudUsuario {
    const estado = this.mapearEstado(item.idEstado);
    const fechaInicio = new Date(item.fechaInicio).toLocaleDateString('es-DO', {
      weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
    });
    const horaI = this.formatearHora(item.horaInicio);
    const horaF = this.formatearHora(item.horaFinal);

    return {
      id:        item.id.toString(),
      titulo:    item.nombreEspacio,
      imagen:    item.imagenLaboratorio ?? 'http://imagenes.cidilipl.online/imagenes/laboratorios/lab-no-disponible.png',
      fecha:     `${fechaInicio} · ${horaI} – ${horaF}`,
      personas:  item.personasCantidad,
      ubicacion: item.tipoRegistro,
      estado,
      enviadaEl: new Date(item.fechaSolicitud).toLocaleDateString('es-DO', {
        day: '2-digit', month: 'short', year: 'numeric',
      }),
      motivo: item.motivo,
      motivoRechazo: estado === 'rechazada' ? item.comentarioAprobacion : undefined,
      aprobadaEl:    estado === 'aprobada'
        ? new Date(item.fechaAprobacion).toLocaleDateString('es-DO', {
            day: '2-digit', month: 'short', year: 'numeric',
          })
        : undefined,
      mensajeEstado: this.buildMensajeEstado(item),
    };
  }

  cargarSolicitudes(): void {
    this.cargando.set(true);

    this.solicitudSvc
      .obtenerTotalReservasEspacioUsuario({ idUsuario: 5 })
      .subscribe({
        next: (total) => {
          const mapeadas = (total.reservas as SolicitudApiUsuario[]).map((item) =>
            this.mapearSolicitud(item),
          );
          this.solicitudes.set(mapeadas);
          this.cargando.set(false);
        },
        error: (err) => {
          console.error('Error al cargar solicitudes:', err);
          this.cargando.set(false);
        },
      });
  }
}
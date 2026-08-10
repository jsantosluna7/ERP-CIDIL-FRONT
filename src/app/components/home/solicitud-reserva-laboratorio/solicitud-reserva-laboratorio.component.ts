import {
  Component,
  signal,
  computed,
  inject,
  OnInit,
  effect,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DetalleSolicitud,
  ModalStateService,
} from '../../elements/modales-globales/modal-state.service';
import { SolicitudReservaEspacioCacheService } from '../../../core/SolicitudReservaEspacioCache/solicitud-reserva-espacio-cache.service';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { environment } from '../../../../environments/environment';

export interface Solicitud {
  id: number;
  idUsuario: number;
  idLaboratorio: number;
  idEstado: number;
  idUsuarioAprobador: number;

  nombreSolicitante: string;
  apellidoSolicitante: string;
  nombreAprobador: string;

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

export interface EstadisticasSolicitudes {
  totalSolicitudes: number;
  totalAprobadas: number;
  totalPendientes: number;
  totalRechazadas: number;
}

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitud-reserva-laboratorio.component.html',
  styleUrls: ['./solicitud-reserva-laboratorio.component.css'],
})
export class SolicitudReservaLaboratorioComponent implements OnInit {
  readonly IMAGENES_URL = environment.imagenesUrl + '/laboratorios/lab-no-disponible.png';
  private modalSvc = inject(ModalStateService);

  filtroEstado = signal<string>('todos');
  busqueda = signal<string>('');
  tabActivo = signal<'espacios' | 'equipos'>('espacios');

  total = signal(0);
  pendientes = signal(0);
  aprobadas = signal(0);
  rechazadas = signal(0);

  paginaActual = signal(1);
  itemsPorPagina = signal(20);
  totalItems = signal(0);

  // ── Loading states ──────────────────────────────────────────
  /** true mientras se carga/recarga la lista de solicitudes */
  cargando = signal(false);
  /** id de la solicitud que se está aprobando en este momento */
  aprobandoId = signal<number | null>(null);
  /** id de la solicitud que se está rechazando en este momento */
  rechazandoId = signal<number | null>(null);
  // ────────────────────────────────────────────────────────────

  usuarioLogueado: any;

  totalPaginas = computed(() =>
    Math.ceil(this.totalItems() / this.itemsPorPagina()),
  );

  inicio = computed(
    () => (this.paginaActual() - 1) * this.itemsPorPagina() + 1,
  );
  fin = computed(() =>
    Math.min(this.paginaActual() * this.itemsPorPagina(), this.totalItems()),
  );

  paginas = computed(() => {
    const total = this.totalPaginas(),
      cur = this.paginaActual();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (cur <= 4) return [1, 2, 3, 4, 5, '...', total];
    if (cur >= total - 3)
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    return [1, '...', cur - 1, cur, cur + 1, '...', total];
  });

  constructor(
    private solicitudSvc: SolicitudReservaEspacioCacheService,
    private _usuarios: UsuariosService,
  ) {
    effect(() => {
      const _filtro = this.filtroEstado();
      const _busqueda = this.busqueda();

      untracked(() => {
        this.paginaActual.set(1);
        this.cargarSolicitudes();
      });
    });
  }

  ngOnInit(): void {
    this.conteo();

    this._usuarios.user$.subscribe((user) => {
      this.usuarioLogueado = user.sub;
    });
  }

  private detalles: Record<string, Omit<DetalleSolicitud, 'id' | 'estado'>> =
    {};

  solicitudes = signal<Solicitud[]>([]);

  solicitudesFiltradas = computed(() => {
    const t = this.busqueda().toLowerCase();
    const estadoFiltro = this.filtroEstado();

    return this.solicitudes().filter((s) => {
      const estadoMatch =
        estadoFiltro === 'todos' ||
        (estadoFiltro === 'pendiente' && s.idEstado === 2) ||
        (estadoFiltro === 'aprobada' && s.idEstado === 1) ||
        (estadoFiltro === 'rechazada' && s.idEstado === 3);

      const nombreCompleto =
        `${s.nombreSolicitante} ${s.apellidoSolicitante}`.toLowerCase();

      const busquedaMatch =
        !t ||
        s.nombreEspacio.toLowerCase().includes(t) ||
        nombreCompleto.includes(t) ||
        s.id.toString().includes(t);

      return estadoMatch && busquedaMatch;
    });
  });

  aprobar(solicitud: Solicitud): void {
    if (!solicitud) {
      console.error('Solicitud es undefined o null');
      return;
    }

    // Evitar doble clic si ya hay una operación en curso para esta solicitud
    if (this.aprobandoId() === solicitud.id) return;

    this.aprobandoId.set(solicitud.id);

    const payload = {
      id: solicitud.id,
      idUsuario: solicitud.idUsuario,
      idLaboratorio: solicitud.idLaboratorio,
      horaInicio: solicitud.horaInicio,
      horaFinal: solicitud.horaFinal,
      fechaInicio: solicitud.fechaInicio,
      fechaFinal: solicitud.fechaFinal,
      motivo: solicitud.motivo,
      fechaSolicitud: solicitud.fechaSolicitud,
      idEstado: 1,
      idUsuarioAprobador: Number(this.usuarioLogueado) || 0,
      fechaAprobacion: new Date().toISOString(),
      comentarioAprobacion: 'Solicitud aprobada',
      personasCantidad: solicitud.personasCantidad,
    };

    this.solicitudSvc.anadirReserva(payload).subscribe({
      next: () => {
        this.solicitudSvc.cancelarSolicitud(solicitud.id).subscribe({
          next: () => {
            this.aprobandoId.set(null);
            this.conteo();
            this.cargarSolicitudes();
          },
          error: (err) => {
            console.error(
              'Error al cancelar solicitud original después de aprobar:',
              err,
            );
            this.aprobandoId.set(null);
          },
        });
      },
      error: (err) => {
        console.error('Error al aprobar solicitud:', err);
        this.aprobandoId.set(null);
      },
    });
  }

  abrirModal(solicitud: Solicitud): void {
    if (!solicitud) return;

    this.modalSvc.abrirRechazo(solicitud.id.toString(), (motivo) => {
      // Activar loading de rechazo al confirmar en el modal
      this.rechazandoId.set(solicitud.id);

      const payload = {
        id: solicitud.id,
        idUsuario: solicitud.idUsuario,
        idLaboratorio: solicitud.idLaboratorio,
        horaInicio: solicitud.horaInicio,
        horaFinal: solicitud.horaFinal,
        fechaInicio: solicitud.fechaInicio,
        fechaFinal: solicitud.fechaFinal,
        motivo: solicitud.motivo,
        fechaSolicitud: solicitud.fechaSolicitud,
        idEstado: 3,
        idUsuarioAprobador: Number(this.usuarioLogueado) || 0,
        fechaAprobacion: new Date().toISOString(),
        comentarioAprobacion: motivo,
        personasCantidad: solicitud.personasCantidad,
      };

      this.solicitudSvc.anadirReserva(payload).subscribe({
        next: () => {
          this.solicitudSvc.cancelarSolicitud(solicitud.id).subscribe({
            next: () => {
              this.rechazandoId.set(null);
              this.conteo();
              this.cargarSolicitudes();
            },
            error: (err) => {
              console.error(
                'Error al cancelar solicitud original después de rechazar:',
                err,
              );
              this.rechazandoId.set(null);
            },
          });
        },
        error: (err) => {
          console.error('Error al rechazar solicitud:', err);
          this.rechazandoId.set(null);
        },
      });
    });
  }

  abrirDetalle(id: number): void {
    const sol = this.solicitudes().find((s) => s.id === id);
    if (!sol) return;

    const det: DetalleSolicitud = {
      id: sol.id.toString(),
      nombreEstado: sol.nombreEstado,
      idEstado: sol.idEstado,
      espacio: sol.nombreEspacio,
      solicitante: `${sol.nombreSolicitante} ${sol.apellidoSolicitante}`.trim(),
      departamento: sol.tipoRegistro,
      fechaHora: `${new Date(sol.fechaInicio).toLocaleDateString('es-DO', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })}`,
      duracion: `${this.formatearHora(sol.horaInicio)} – ${this.formatearHora(sol.horaFinal)}`,
      personas: sol.personasCantidad,
      motivo: sol.motivo,
      aprobadoPor: sol.nombreAprobador || 'Pendiente de aprobación',
    };

    this.modalSvc.abrirDetalle(det);
  }

  conteo() {
    this.solicitudSvc
      .obtenerConteoReservas()
      .subscribe((conteo: EstadisticasSolicitudes) => {
        this.total.set(conteo.totalSolicitudes);
        this.pendientes.set(conteo.totalPendientes);
        this.aprobadas.set(conteo.totalAprobadas);
        this.rechazadas.set(conteo.totalRechazadas);
      });
  }

  cargarSolicitudes(): void {
    const estadoMap: Record<string, number | undefined> = {
      todos: undefined,
      pendiente: 2,
      aprobada: 1,
      rechazada: 3,
    };

    this.cargando.set(true);

    this.solicitudSvc
      .obtenerTotalReservasEspacio({
        idEstado: estadoMap[this.filtroEstado()],
        busqueda: this.busqueda() || undefined,
        pagina: this.paginaActual(),
        tamanoPagina: this.itemsPorPagina(),
      })
      .subscribe({
        next: (res) => {
          this.solicitudes.set(res.reservasDeEspacios);
          this.totalItems.set(res.total ?? res.reservasDeEspacios.length);
          this.cargando.set(false);
        },
        error: (err) => {
          console.error('Error al cargar solicitudes:', err);
          this.cargando.set(false);
        },
      });
  }

  irAPagina(n: number): void {
    if (n >= 1 && n <= this.totalPaginas()) {
      this.paginaActual.set(n);
      this.cargarSolicitudes();
    }
  }

  cambiarPorPagina(valor: number): void {
    this.itemsPorPagina.set(valor);
    this.paginaActual.set(1);
    this.cargarSolicitudes();
  }

  estadoClase(idEstado: number): string {
    const map: Record<number, string> = {
      1: 'aprobada',
      2: 'pendiente',
      3: 'rechazada',
    };
    return map[idEstado] ?? '';
  }

  formatearHora(hora: string): string {
    const [h, m] = hora.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
  }
}

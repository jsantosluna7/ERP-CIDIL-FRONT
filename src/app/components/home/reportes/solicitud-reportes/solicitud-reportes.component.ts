import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ReporteFallaService } from '../../../../services/Api/ReporteFalla/reporteFalla.service';
import { ToastrService } from 'ngx-toastr';
import { UsuariosService } from '../../../../services/Api/Usuarios/usuarios.service';
import { UsuarioService } from '../../usuario/usuarios/usuarios.service';

type Estado = 'recibido' | 'proceso' | 'completado';
type CampoFiltro = 'usuario' | 'lugar' | 'categoria';

interface Reporte {
  id: number;
  idUsuario: number; // se necesita para resolver el nombre vía UsuarioService
  usuario: string; // "Usuario #<id>" hasta resolver, luego "nombre apellido"
  categoria: string;
  lugar: string;
  descripcion: string;
  estado: Estado;
  fecha: string | null; // ISO, puede venir null desde la API
}

interface EstadoInfo {
  label: string;
  icon: string;
}

// ── Mapeo entre el estado numérico que maneja la API y el estado
//    en texto que usa este componente. AJUSTA ESTOS NÚMEROS si tu
//    backend usa otra numeración (por ejemplo 0/1/2 en vez de 1/2/3).
const ESTADO_API_A_LOCAL: Record<number, Estado> = {
  1: 'recibido',
  2: 'proceso',
  3: 'completado',
};

const ESTADO_LOCAL_A_API: Record<Estado, number> = {
  recibido: 1,
  proceso: 2,
  completado: 3,
};

@Component({
  selector: 'app-ver-reportes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitud-reportes.component.html',
  styleUrl: './solicitud-reportes.component.css',
})
export class SolicitudReportesComponent implements OnInit {
  // ── Datos (se llenan desde la API en ngOnInit) ──
  reportes: Reporte[] = [];
  cargando = false;

  // Filas placeholder para el skeleton de la tabla mientras `cargando` es true.
  // El contenido no importa, solo la cantidad de filas a dibujar.
  skeletonRows = new Array(6);

  // Estado de guardado del modal de actualización (controla el spinner
  // del botón "Guardar Cambios").
  guardando = false;

  estadoInfo: Record<Estado, EstadoInfo> = {
    recibido: {
      label: 'Recibido',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
    },
    proceso: {
      label: 'En proceso',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>',
    },
    completado: {
      label: 'Completado',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 17"/></svg>',
    },
  };

  estados: Estado[] = ['recibido', 'proceso', 'completado'];
  campos: { field: CampoFiltro; label: string }[] = [
    { field: 'usuario', label: 'Usuario' },
    { field: 'lugar', label: 'Lugar' },
    { field: 'categoria', label: 'Categoría' },
  ];

  // ── Reactive Form: búsqueda y filtros ──
  filtrosForm = new FormGroup({
    search: new FormControl<string>(''),
    filterField: new FormControl<CampoFiltro>('usuario'),
    estadoFilter: new FormControl<'todos' | Estado>('todos'),
    perPage: new FormControl<number>(20),
  });

  // ── Reactive Form: modal de estado ──
  estadoForm = new FormGroup({
    estado: new FormControl<Estado>('recibido'),
  });

  currentPage = 1;
  totalPages = 1;

  modalVisible = false;
  modalReporte: Reporte | null = null;

  popoverVisible = false;
  popoverReporte: Reporte | null = null;
  popoverTop = 0;
  popoverLeft = 0;

  constructor(
    private _reportes: ReporteFallaService,
    private _usuario: UsuariosService,
    private _usuarioService: UsuarioService,
    private _toastr: ToastrService,
  ) {}

  get search(): string {
    return this.filtrosForm.get('search')?.value ?? '';
  }
  get filterField(): CampoFiltro {
    return (this.filtrosForm.get('filterField')?.value ??
      'usuario') as CampoFiltro;
  }
  get estadoFilter(): 'todos' | Estado {
    return (this.filtrosForm.get('estadoFilter')?.value ?? 'todos') as
      | 'todos'
      | Estado;
  }
  get perPage(): number {
    return this.filtrosForm.get('perPage')?.value ?? 20;
  }

  ngOnInit(): void {
    this.filtrosForm.valueChanges.subscribe(() => {
      this.currentPage = 1;
    });

    this.cargarReportes();
  }

  // ── Carga de reportes desde la API ──
  cargarReportes(): void {
    this.cargando = true;
    this._reportes
      .getReportes()
      .pipe(
        switchMap((data) => {
          const reportesMapeados = (data as any[]).map((r) =>
            this.mapReporteApiALocal(r),
          );
          return this.resolverNombresUsuarios(reportesMapeados);
        }),
      )
      .subscribe({
        next: (reportesConNombres) => {
          this.reportes = reportesConNombres;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al cargar reportes:', err);
          this._toastr.error('No se pudieron cargar los reportes.');
          this.cargando = false;
        },
      });
  }

  // Convierte el objeto que devuelve la API (idReporte, idUsuario, estado
  // numérico, etc.) al shape que usa este componente. El nombre del
  // usuario todavía no está resuelto en este punto; se rellena luego en
  // resolverNombresUsuarios().
  private mapReporteApiALocal(r: any): Reporte {
    return {
      id: r.idReporte,
      idUsuario: r.idUsuario,
      usuario: `Usuario #${r.idUsuario}`, // placeholder hasta resolver el nombre
      categoria: r.categoria,
      lugar: r.lugar,
      descripcion: r.descripcion,
      estado: ESTADO_API_A_LOCAL[r.estado] ?? 'recibido',
      fecha: r.fechaCreacion ?? r.fechaUltimaActualizacion ?? null,
    };
  }

  // Dado un array de reportes ya mapeados (con idUsuario), pide a
  // UsuarioService los datos de cada usuario único vía obtenerUsuarioId()
  // y devuelve el mismo array de reportes con `usuario` reemplazado por
  // "nombreUsuario apellidoUsuario".
  //
  // Si la llamada para un id específico falla, ese reporte conserva el
  // placeholder "Usuario #<id>" en vez de tumbar toda la carga de reportes.
  private resolverNombresUsuarios(reportes: Reporte[]) {
    const idsUnicos = Array.from(new Set(reportes.map((r) => r.idUsuario)));

    if (idsUnicos.length === 0) {
      return of(reportes);
    }

    const llamadas = idsUnicos.map((id) =>
      this._usuarioService.obtenerUsuarioId(id).pipe(
        catchError((err) => {
          console.error(`Error al obtener usuario #${id}:`, err);
          return of(null); // no tumba el forkJoin completo
        }),
      ),
    );

    return forkJoin(llamadas).pipe(
      switchMap((usuariosResueltos) => {
        const mapaNombres = new Map<number, string>();
        idsUnicos.forEach((id, i) => {
          const u = usuariosResueltos[i];
          if (u) {
            const nombreCompleto = `${u.nombreUsuario ?? ''} ${
              u.apellidoUsuario ?? ''
            }`.trim();
            if (nombreCompleto) mapaNombres.set(id, nombreCompleto);
          }
        });

        const reportesActualizados = reportes.map((r) => ({
          ...r,
          usuario: mapaNombres.get(r.idUsuario) ?? r.usuario,
        }));

        return of(reportesActualizados);
      }),
    );
  }

  // ── Datos filtrados / paginados ──
  get datosFiltrados(): Reporte[] {
    let data = [...this.reportes];
    if (this.estadoFilter !== 'todos') {
      data = data.filter((r) => r.estado === this.estadoFilter);
    }
    const search = this.search.trim().toLowerCase();
    if (search) {
      data = data.filter((r) =>
        String(r[this.filterField] ?? '')
          .toLowerCase()
          .includes(search),
      );
    }
    return data;
  }

  get datosPagina(): Reporte[] {
    const data = this.datosFiltrados;
    this.totalPages = Math.max(1, Math.ceil(data.length / this.perPage));
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    const start = (this.currentPage - 1) * this.perPage;
    return data.slice(start, start + this.perPage);
  }

  get rangeStart(): number {
    const total = this.datosFiltrados.length;
    return total === 0 ? 0 : (this.currentPage - 1) * this.perPage + 1;
  }
  get rangeEnd(): number {
    return Math.min(
      this.currentPage * this.perPage,
      this.datosFiltrados.length,
    );
  }

  get totalReportes(): number {
    return this.reportes.length;
  }
  get totalRecibidos(): number {
    return this.reportes.filter((r) => r.estado === 'recibido').length;
  }
  get totalProceso(): number {
    return this.reportes.filter((r) => r.estado === 'proceso').length;
  }
  get totalCompletados(): number {
    return this.reportes.filter((r) => r.estado === 'completado').length;
  }

  // ── Filtros ──
  setFilterField(field: CampoFiltro): void {
    this.filtrosForm.get('filterField')?.setValue(field);
  }

  setEstadoFilter(estado: 'todos' | Estado): void {
    this.filtrosForm.get('estadoFilter')?.setValue(estado);
  }

  placeholderBusqueda(): string {
    const labels: Record<CampoFiltro, string> = {
      usuario: 'Usuario',
      lugar: 'Lugar',
      categoria: 'Categoría',
    };
    return 'Buscar por ' + labels[this.filterField];
  }

  onPerPageChange(): void {
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  // ── Formateo de fechas ──
  formatFecha(iso: string | null): string {
    if (!iso) return 'Sin fecha';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return 'Sin fecha';
    const fecha = d.toLocaleDateString('es-DO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const hora = d.toLocaleTimeString('es-DO', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${fecha} · ${hora}`;
  }

  formatFechaCorta(iso: string | null): string {
    if (!iso) return 'Sin fecha';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return 'Sin fecha';
    return d.toLocaleDateString('es-DO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  // ── Popover de detalle rápido ──
  toggleInfoPopover(reporte: Reporte, event: MouseEvent): void {
    event.stopPropagation();
    const yaAbierto =
      this.popoverVisible && this.popoverReporte?.id === reporte.id;
    this.cerrarPopover();
    if (yaAbierto) return;

    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const popWidth = 300;
    let left = rect.left;
    if (left + popWidth > window.innerWidth - 12)
      left = window.innerWidth - popWidth - 12;
    if (left < 12) left = 12;

    this.popoverTop = rect.bottom + 8;
    this.popoverLeft = left;
    this.popoverReporte = reporte;
    this.popoverVisible = true;
  }

  cerrarPopover(): void {
    this.popoverVisible = false;
    this.popoverReporte = null;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.cerrarPopover();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onScrollOrResize(): void {
    this.cerrarPopover();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.cerrarModal();
    this.cerrarPopover();
  }

  // ── Modal de estado ──
  abrirModal(reporte: Reporte): void {
    this.cerrarPopover();
    this.modalReporte = reporte;
    this.estadoForm.get('estado')?.setValue(reporte.estado);
    this.modalVisible = true;
    document.body.style.overflow = 'hidden';
  }

  setModalEstado(estado: Estado): void {
    this.estadoForm.get('estado')?.setValue(estado);
  }

  cerrarModal(): void {
    if (this.guardando) return; // evita cerrar mientras se está guardando
    this.modalVisible = false;
    this.modalReporte = null;
    document.body.style.overflow = '';
  }

  guardarEstado(): void {
    if (!this.modalReporte || this.guardando) return;

    const idReporte = this.modalReporte.id;
    const nuevoEstado = this.estadoForm.get('estado')?.value as Estado;
    const estadoApi = ESTADO_LOCAL_A_API[nuevoEstado];

    this.guardando = true;

    this._reportes
      .actualizarReporte(idReporte, { IdReporte: idReporte, estado: estadoApi })
      .subscribe({
        next: () => {
          const reporte = this.reportes.find((r) => r.id === idReporte);
          if (reporte) reporte.estado = nuevoEstado;
          this._toastr.success('Estado actualizado correctamente.');
          this.guardando = false;
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al actualizar estado:', err);
          this._toastr.error('No se pudo actualizar el estado.');
          this.guardando = false;
        },
      });
  }

  eliminarReporte(reporte: Reporte): void {
    this.cerrarPopover();
    const confirmado = confirm(
      `¿Eliminar el reporte de ${reporte.usuario} en "${reporte.lugar}"?`,
    );
    if (!confirmado) return;

    // ⚠️ ReporteFallaService no expone todavía un endpoint de eliminación
    // (no hay método delete/eliminar). Por ahora esto solo quita el
    // reporte de la vista local; no se elimina en el servidor. Cuando el
    // backend agregue un DELETE, se llamaría aquí antes de filtrar el array.
    this.reportes = this.reportes.filter((r) => r.id !== reporte.id);
    this._toastr.info(
      'Reporte quitado de la vista (aún no hay endpoint para eliminarlo en el servidor).',
    );
  }

  trackByReporteId(_index: number, reporte: Reporte): number {
    return reporte.id;
  }
}

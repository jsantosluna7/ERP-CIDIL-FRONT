import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReporteFallaService } from '../../../../services/Api/ReporteFalla/reporteFalla.service';
import { UsuariosService } from '../../../../services/Api/Usuarios/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { ReporteFalla } from '../../../../interfaces/reporteFalla.interface';

type Estado = 'recibido' | 'proceso' | 'completado';
type FilterField = 'lugar' | 'categoria';

interface Reporte {
  id: number;
  categoria: string;
  lugar: string;
  descripcion: string;
  estado: Estado;
  fecha: string; // ISO o '' si no viene fecha
}

interface EstadoInfo {
  label: string;
}

// Mapeo entre el número que maneja el backend y el estado que usa la UI
const ESTADO_NUM_TO_KEY: Record<number, Estado> = {
  1: 'recibido',
  2: 'proceso',
  3: 'completado',
};
const ESTADO_KEY_TO_NUM: Record<Estado, number> = {
  recibido: 1,
  proceso: 2,
  completado: 3,
};

@Component({
  selector: 'app-mis-reportes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reportes-usuario.component.html',
  styleUrl: './reportes-usuario.component.css',
})
export class ReportesUsuarioComponent implements OnInit {
  estadoInfo: Record<Estado, EstadoInfo> = {
    recibido: { label: 'Recibido' },
    proceso: { label: 'En proceso' },
    completado: { label: 'Completado' },
  };

  estados: Estado[] = ['recibido', 'proceso', 'completado'];

  reportes: Reporte[] = [];
  loading = true;
  errorMsg: string | null = null;
  skeletonRows = Array.from({ length: 6 }); // filas fantasma mientras carga

  // ── Reactive Form: búsqueda + filtros ──
  filtersForm: FormGroup;

  currentPage = 1;
  perPage = 20;
  totalPages = 1;

  // ── Modal ──
  modalVisible = false;
  modalReportId: number | null = null;
  modalEstadoActual: Estado = 'recibido';
  modalReporte: Reporte | null = null;

  usuarioLogueado: any;

  constructor(
    private fb: FormBuilder,
    private _reportes: ReporteFallaService,
    private _usuario: UsuariosService,
    private _toastr: ToastrService,
  ) {
    this.filtersForm = this.fb.group({
      search: [''],
      filterField: ['lugar' as FilterField],
      estadoFilter: ['todos' as Estado | 'todos'],
      perPage: [20],
    });
  }

  ngOnInit(): void {
    this.filtersForm.get('search')?.valueChanges.subscribe(() => {
      this.currentPage = 1;
    });
    this.filtersForm.get('filterField')?.valueChanges.subscribe(() => {
      this.currentPage = 1;
    });
    this.filtersForm.get('estadoFilter')?.valueChanges.subscribe(() => {
      this.currentPage = 1;
    });
    this.filtersForm.get('perPage')?.valueChanges.subscribe((val: number) => {
      this.perPage = Number(val);
      this.currentPage = 1;
    });

    this._usuario.user$.subscribe((usuario) => {
      if (usuario) {
        this.usuarioLogueado = usuario;
        this.cargarReportes();
      }
    });
  }

  get usuarioNombreCompleto(): string {
    if (!this.usuarioLogueado) return '';
    return `${this.usuarioLogueado.nombreUsuario ?? ''} ${this.usuarioLogueado.apellidoUsuario ?? ''}`.trim();
  }

  // ── Carga desde API ──
  cargarReportes(): void {
    const id = Number(this.usuarioLogueado?.sub);
    if (!id) {
      this.errorMsg = 'No se pudo identificar al usuario.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.errorMsg = null;

    this._reportes.getMiReportes(id).subscribe({
      next: (data: ReporteFalla[]) => {
        this.reportes = data.map((r) => this.mapReporte(r));
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'No se pudieron cargar tus reportes. Intenta de nuevo.';
        this.loading = false;
        this._toastr.error(this.errorMsg);
      },
    });
  }

  private mapReporte(r: ReporteFalla): Reporte {
    return {
      id: r.idReporte as number,
      categoria: r.categoria,
      lugar: r.lugar,
      descripcion: r.descripcion,
      estado: ESTADO_NUM_TO_KEY[r.estado] ?? 'recibido',
      fecha: r.fechaCreacion ? new Date(r.fechaCreacion).toISOString() : '',
    };
  }

  // ── Helpers de datos ──
  get filteredReportes(): Reporte[] {
    const { search, filterField, estadoFilter } = this.filtersForm.value;
    let data = this.reportes;

    if (estadoFilter !== 'todos') {
      data = data.filter((r) => r.estado === estadoFilter);
    }

    const term = (search ?? '').trim().toLowerCase();
    if (term) {
      data = data.filter((r) =>
        String((r as any)[filterField as FilterField] ?? '')
          .toLowerCase()
          .includes(term),
      );
    }

    return data;
  }

  get pagedReportes(): Reporte[] {
    const data = this.filteredReportes;
    this.totalPages = Math.max(1, Math.ceil(data.length / this.perPage));
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    const start = (this.currentPage - 1) * this.perPage;
    return data.slice(start, start + this.perPage);
  }

  get rangeStart(): number {
    const total = this.filteredReportes.length;
    return total === 0 ? 0 : (this.currentPage - 1) * this.perPage + 1;
  }

  get rangeEnd(): number {
    const total = this.filteredReportes.length;
    return Math.min(this.currentPage * this.perPage, total);
  }

  // ── Estadísticas ──
  get statTotal(): number {
    return this.reportes.length;
  }
  get statRecibido(): number {
    return this.reportes.filter((r) => r.estado === 'recibido').length;
  }
  get statProceso(): number {
    return this.reportes.filter((r) => r.estado === 'proceso').length;
  }
  get statCompletado(): number {
    return this.reportes.filter((r) => r.estado === 'completado').length;
  }

  // ── Filtros de campo / estado ──
  setFilterField(field: FilterField): void {
    this.filtersForm.get('filterField')?.setValue(field);
  }

  setEstadoFilter(estado: Estado | 'todos'): void {
    this.filtersForm.get('estadoFilter')?.setValue(estado);
  }

  get searchPlaceholder(): string {
    const field = this.filtersForm.get('filterField')?.value as FilterField;
    const labels: Record<FilterField, string> = {
      lugar: 'Lugar',
      categoria: 'Categoría',
    };
    return 'Buscar por ' + labels[field];
  }

  // ── Paginación ──
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  // ── Formato de fecha ──
  formatFecha(iso: string): string {
    if (!iso) return '—';
    const d = new Date(iso);
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

  // ── Modal de detalle / estado ──
  abrirModal(id: number): void {
    const r = this.reportes.find((x) => x.id === id);
    if (!r) return;
    this.modalReportId = id;
    this.modalReporte = r;
    this.modalEstadoActual = r.estado;
    this.modalVisible = true;
    document.body.style.overflow = 'hidden';
  }

  setModalEstado(estado: Estado): void {
    this.modalEstadoActual = estado;
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.modalReportId = null;
    this.modalReporte = null;
    document.body.style.overflow = '';
  }

  guardarEstado(): void {
    if (this.modalReportId == null) return;
    const idReporte = this.modalReportId;
    const nuevoEstadoNum = ESTADO_KEY_TO_NUM[this.modalEstadoActual];

    this._reportes
      .actualizarReporte(idReporte, {
        IdReporte: idReporte,
        estado: nuevoEstadoNum,
      })
      .subscribe({
        next: () => {
          const r = this.reportes.find((x) => x.id === idReporte);
          if (r) r.estado = this.modalEstadoActual;
          this._toastr.success('Estado actualizado.');
          this.cerrarModal();
        },
        error: () => {
          this._toastr.error('No se pudo actualizar el estado.');
        },
      });
  }

  eliminarDesdeModal(): void {
    // No hay endpoint de eliminación en el servicio todavía; se deja pendiente de backend.
    const r = this.reportes.find((x) => x.id === this.modalReportId);
    if (!r) return;
    if (confirm(`¿Eliminar tu reporte en "${r.lugar}"?`)) {
      this.reportes = this.reportes.filter((x) => x.id !== r.id);
      this.cerrarModal();
    }
  }

  onEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.cerrarModal();
  }

  trackByReporteId(_index: number, r: Reporte): number {
    return r.id;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

type Estado = 'recibido' | 'proceso' | 'completado';
type FilterField = 'lugar' | 'categoria';

interface Reporte {
  id: number;
  usuario: string;
  categoria: string;
  lugar: string;
  descripcion: string;
  estado: Estado;
  fecha: string; // ISO
}

interface EstadoInfo {
  label: string;
}

@Component({
  selector: 'app-mis-reportes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reportes-usuario.component.html',
  styleUrl: './reportes-usuario.component.css',
})
export class ReportesUsuarioComponent implements OnInit {
  // Placeholder: reemplazar con el usuario autenticado real (p. ej. desde sesión/token/servicio de auth).
  currentUsuario = 'Jesus Joan Santos Luna';

  estadoInfo: Record<Estado, EstadoInfo> = {
    recibido: { label: 'Recibido' },
    proceso: { label: 'En proceso' },
    completado: { label: 'Completado' },
  };

  estados: Estado[] = ['recibido', 'proceso', 'completado'];

  // Mismo dataset simulado que ver-reportes (fuente única de reportes de la plataforma).
  // En producción esto vendría de un servicio (HttpClient) inyectado.
  reportes: Reporte[] = [
    {
      id: 1,
      usuario: 'Jesus Joan Santos Luna',
      categoria: 'Equipo',
      lugar: 'Aula 203',
      descripcion:
        'El proyector no enciende, probamos con otro cable HDMI y sigue sin dar imagen.',
      estado: 'proceso',
      fecha: '2026-08-25T09:15:00',
    },
    {
      id: 2,
      usuario: 'Maria Fernanda Cruz',
      categoria: 'Red',
      lugar: 'Laboratorio 2',
      descripcion:
        'No hay conexión a internet en ninguna de las computadoras del laboratorio.',
      estado: 'recibido',
      fecha: '2026-08-26T14:02:00',
    },
    {
      id: 3,
      usuario: 'Pedro Alexander Diaz',
      categoria: 'Infraestructura',
      lugar: 'Pasillo edificio B',
      descripcion:
        'Dos lámparas fundidas dejan el pasillo casi a oscuras después de las 6pm.',
      estado: 'completado',
      fecha: '2026-08-18T11:40:00',
    },
    {
      id: 4,
      usuario: 'Carla Beatriz Nuñez',
      categoria: 'Equipo',
      lugar: 'Sala de profesores',
      descripcion: 'El aire acondicionado gotea sobre uno de los escritorios.',
      estado: 'proceso',
      fecha: '2026-08-24T08:30:00',
    },
    {
      id: 5,
      usuario: 'Jesus Joan Santos Luna',
      categoria: 'Red',
      lugar: 'Rack principal',
      descripcion:
        'El switch del segundo piso reinicia solo cada cierto tiempo.',
      estado: 'recibido',
      fecha: '2026-08-27T07:55:00',
    },
    {
      id: 6,
      usuario: 'Luis Manuel Fabian',
      categoria: 'Infraestructura',
      lugar: 'Aula 105',
      descripcion:
        'Una silla tiene una pata rota y es peligrosa para los estudiantes.',
      estado: 'completado',
      fecha: '2026-08-15T16:20:00',
    },
    {
      id: 7,
      usuario: 'Ana Sofia Reyes',
      categoria: 'Otro',
      lugar: 'Cafetería',
      descripcion: 'El dispensador de agua no está enfriando correctamente.',
      estado: 'recibido',
      fecha: '2026-08-26T12:10:00',
    },
  ];

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

  constructor(private fb: FormBuilder) {
    this.filtersForm = this.fb.group({
      search: [''],
      filterField: ['lugar' as FilterField],
      estadoFilter: ['todos' as Estado | 'todos'],
      perPage: [20],
    });
  }

  ngOnInit(): void {
    // Cada cambio en el form re-renderiza (currentPage se resetea salvo perPage manual controlado abajo).
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
  }

  // ── Helpers de datos ──
  get misReportes(): Reporte[] {
    return this.reportes.filter((r) => r.usuario === this.currentUsuario);
  }

  get filteredReportes(): Reporte[] {
    const { search, filterField, estadoFilter } = this.filtersForm.value;
    let data = this.misReportes;

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
    return this.misReportes.length;
  }
  get statRecibido(): number {
    return this.misReportes.filter((r) => r.estado === 'recibido').length;
  }
  get statProceso(): number {
    return this.misReportes.filter((r) => r.estado === 'proceso').length;
  }
  get statCompletado(): number {
    return this.misReportes.filter((r) => r.estado === 'completado').length;
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
    const r = this.reportes.find(
      (x) => x.id === id && x.usuario === this.currentUsuario,
    );
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
    const r = this.reportes.find(
      (x) => x.id === this.modalReportId && x.usuario === this.currentUsuario,
    );
    if (r) r.estado = this.modalEstadoActual;
    this.cerrarModal();
  }

  eliminarDesdeModal(): void {
    const r = this.reportes.find(
      (x) => x.id === this.modalReportId && x.usuario === this.currentUsuario,
    );
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

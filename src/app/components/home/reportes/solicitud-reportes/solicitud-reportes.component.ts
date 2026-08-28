import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

type Estado = 'recibido' | 'proceso' | 'completado';
type CampoFiltro = 'usuario' | 'lugar' | 'categoria';

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
  icon: string;
}

@Component({
  selector: 'app-ver-reportes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitud-reportes.component.html',
  styleUrl: './solicitud-reportes.component.css',
})
export class SolicitudReportesComponent implements OnInit {
  // ── Datos ──
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

  formatFechaCorta(iso: string): string {
    const d = new Date(iso);
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
    this.modalVisible = false;
    this.modalReporte = null;
    document.body.style.overflow = '';
  }

  guardarEstado(): void {
    if (!this.modalReporte) return;
    const nuevoEstado = this.estadoForm.get('estado')?.value as Estado;
    const reporte = this.reportes.find((r) => r.id === this.modalReporte!.id);
    if (reporte) reporte.estado = nuevoEstado;
    this.cerrarModal();
  }

  eliminarReporte(reporte: Reporte): void {
    this.cerrarPopover();
    const confirmado = confirm(
      `¿Eliminar el reporte de ${reporte.usuario} en "${reporte.lugar}"?`,
    );
    if (confirmado) {
      this.reportes = this.reportes.filter((r) => r.id !== reporte.id);
    }
  }

  trackByReporteId(_index: number, reporte: Reporte): number {
    return reporte.id;
  }
}

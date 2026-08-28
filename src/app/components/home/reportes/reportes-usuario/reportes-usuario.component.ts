import {
  Component,
  HostListener,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

type Estado = 'recibido' | 'proceso' | 'completado';
type EstadoFiltro = 'todos' | Estado;
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

@Component({
  selector: 'app-reportes-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './reportes-usuario.component.html',
  styleUrl: './reportes-usuario.component.css',
})
export class ReportesUsuarioComponent {
  private readonly fb = inject(FormBuilder);

  readonly estadoLabels: Record<Estado, string> = {
    recibido: 'Recibido',
    proceso: 'En proceso',
    completado: 'Completado',
  };

  readonly filterFieldLabels: Record<FilterField, string> = {
    lugar: 'Lugar',
    categoria: 'Categoría',
  };

  /** Placeholder: sustituir por el usuario autenticado real (p. ej. desde sesión/token) */
  readonly currentUsuario = signal('Jesus Joan Santos Luna');

  /** Datos de ejemplo — sustituir por la llamada al servicio correspondiente */
  readonly reportes = signal<Reporte[]>([
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
  ]);

  /** Solo los reportes del usuario actual — esta vista es de solo lectura */
  readonly misReportes = computed(() =>
    this.reportes().filter((r) => r.usuario === this.currentUsuario()),
  );

  readonly filtroForm = this.fb.nonNullable.group({
    search: [''],
    filterField: ['lugar' as FilterField],
    estadoFiltro: ['todos' as EstadoFiltro],
    perPage: [20],
  });

  /** Snapshot reactivo del formulario de búsqueda/filtros, usado por los computed de abajo */
  readonly filtro = toSignal(this.filtroForm.valueChanges, {
    initialValue: this.filtroForm.getRawValue(),
  });

  readonly currentPage = signal(1);

  readonly modalReportId = signal<number | null>(null);

  readonly stats = computed(() => {
    const data = this.misReportes();
    return {
      total: data.length,
      recibido: data.filter((r) => r.estado === 'recibido').length,
      proceso: data.filter((r) => r.estado === 'proceso').length,
      completado: data.filter((r) => r.estado === 'completado').length,
    };
  });

  readonly datosFiltrados = computed(() => {
    const { search, filterField, estadoFiltro } = this.filtro();
    const term = (search ?? '').trim().toLowerCase();

    let data = this.misReportes();
    if (estadoFiltro !== 'todos') {
      data = data.filter((r) => r.estado === estadoFiltro);
    }
    if (term) {
      const field: FilterField = filterField ?? 'lugar';
      data = data.filter((r) =>
        String(r[field] ?? '')
          .toLowerCase()
          .includes(term),
      );
    }
    return data;
  });

  readonly totalPages = computed(() => {
    const perPage = this.filtro().perPage;
    return Math.max(1, Math.ceil(this.datosFiltrados().length / (perPage ?? 1)));
  });

  /** currentPage recortado al rango válido cuando un filtro reduce los resultados */
  readonly paginaActual = computed(() =>
    Math.min(this.currentPage(), this.totalPages()),
  );

  readonly datosPagina = computed(() => {
    const perPage = this.filtro().perPage ?? 1;
    const start = (this.paginaActual() - 1) * perPage;
    return this.datosFiltrados().slice(start, start + perPage);
  });

  readonly rangoInicio = computed(() => {
    if (this.datosFiltrados().length === 0) return 0;
    const perPage = this.filtro().perPage ?? 1;
    return (this.paginaActual() - 1) * perPage + 1;
  });

  readonly rangoFin = computed(() => {
    const perPage = this.filtro().perPage ?? 1;
    const start = (this.paginaActual() - 1) * perPage;
    return Math.min(start + perPage, this.datosFiltrados().length);
  });

  /** Reporte mostrado en el modal — siempre acotado a misReportes(), nunca a la lista completa */
  readonly reporteSeleccionado = computed(() => {
    const id = this.modalReportId();
    return id === null
      ? null
      : (this.misReportes().find((r) => r.id === id) ?? null);
  });

  constructor() {
    // Bloquea el scroll del body mientras el modal está abierto, igual que el original
    effect(() => {
      document.body.style.overflow =
        this.modalReportId() === null ? '' : 'hidden';
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.cerrarModal();
  }

  setFilterField(field: FilterField): void {
    this.filtroForm.controls.filterField.setValue(field);
    this.currentPage.set(1);
  }

  setEstadoFiltro(estado: EstadoFiltro): void {
    this.filtroForm.controls.estadoFiltro.setValue(estado);
    this.currentPage.set(1);
  }

  onPerPageChange(): void {
    this.currentPage.set(1);
  }

  irAPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPages()) return;
    this.currentPage.set(pagina);
  }

  formatFecha(iso: string): string {
    const fecha = new Date(iso);
    const dia = fecha.toLocaleDateString('es-DO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const hora = fecha.toLocaleTimeString('es-DO', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${dia} · ${hora}`;
  }

  abrirModal(id: number): void {
    const reporte = this.misReportes().find((r) => r.id === id);
    if (!reporte) return;
    this.modalReportId.set(id);
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.modalReportId.set(null);
  }
}

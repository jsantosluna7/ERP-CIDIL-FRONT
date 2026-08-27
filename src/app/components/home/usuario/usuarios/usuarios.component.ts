import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  matricula: string;
  telefono: string;
  email: string;
  direccion: string;
  rol: number;
  activo: boolean;
}

type UsuarioConRol = Usuario & { rolNombre: string };

type CampoFiltro = 'nombre' | 'apellido' | 'matricula' | 'email' | 'rolNombre';

interface FiltroChip {
  field: CampoFiltro;
  label: string;
}

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent {
  // ─── Catálogos ─────────────────────────────────────────────
  readonly roles: Record<number, string> = {
    1: 'Estudiante',
    2: 'Docente',
    3: 'Coordinador',
    4: 'Administrador',
  };

  readonly rolesOptions = Object.entries(this.roles).map(([id, nombre]) => ({
    id: Number(id),
    nombre,
  }));

  readonly filtros: FiltroChip[] = [
    { field: 'nombre', label: 'Nombre' },
    { field: 'apellido', label: 'Apellido' },
    { field: 'matricula', label: 'Matrícula' },
    { field: 'email', label: 'Email' },
    { field: 'rolNombre', label: 'Rol' },
  ];

  // ─── Datos ─────────────────────────────────────────────────
  usuarios: Usuario[] = [
    {
      id: 1,
      nombre: 'Joan',
      apellido: 'Santos',
      matricula: '1513',
      telefono: '8097770610',
      email: 'jesussantos@ipl.edu.do',
      direccion: 'Calle Guarocuya',
      rol: 1,
      activo: true,
    },
    {
      id: 5,
      nombre: 'JESUS JOAN',
      apellido: 'SANTOS LUNA',
      matricula: '10089635',
      telefono: '(809) 777-0610',
      email: '10089635@ipl.edu.do',
      direccion: 'Calle Guarocuya #06',
      rol: 4,
      activo: true,
    },
  ];

  // ─── Formulario reactivo: búsqueda / filtros / paginación ───
  filtrosForm: FormGroup;
  filterField: CampoFiltro = 'nombre';

  // ─── Formulario reactivo: edición de usuario ────────────────
  editForm: FormGroup;

  usuariosFiltrados: UsuarioConRol[] = [];
  usuariosPagina: UsuarioConRol[] = [];
  currentPage = 1;
  totalPages = 1;

  isModalOpen = false;
  modalSubtitle = '—';

  popoverVisible = false;
  popoverUsuario: Usuario | null = null;
  popoverTop = 0;
  popoverLeft = 0;

  @ViewChild('infoPopover') infoPopoverRef?: ElementRef<HTMLDivElement>;

  constructor(private fb: FormBuilder) {
    this.filtrosForm = this.fb.group({
      search: [''],
      perPage: [20],
    });

    this.editForm = this.fb.group({
      id: [0],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      matricula: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      rol: [1, Validators.required],
      activo: [true],
    });

    this.filtrosForm.get('search')!.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.actualizarVista();
    });

    this.filtrosForm.get('perPage')!.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.actualizarVista();
    });

    this.actualizarVista();
  }

  // ─── Helpers de filtros ──────────────────────────────────────
  get searchPlaceholder(): string {
    const chip = this.filtros.find((f) => f.field === this.filterField);
    return `Buscar por ${chip?.label ?? ''}`;
  }

  setFilterField(field: CampoFiltro): void {
    this.filterField = field;
    this.currentPage = 1;
    this.actualizarVista();
  }

  private get perPage(): number {
    return Number(this.filtrosForm.get('perPage')!.value) || 20;
  }

  private get searchTerm(): string {
    return String(this.filtrosForm.get('search')!.value ?? '')
      .trim()
      .toLowerCase();
  }

  // ─── Cálculo de tabla / paginación ───────────────────────────
  actualizarVista(): void {
    this.cerrarInfoPopover();

    let data: UsuarioConRol[] = this.usuarios.map((u) => ({
      ...u,
      rolNombre: this.roles[u.rol] ?? '—',
    }));

    const term = this.searchTerm;
    if (term) {
      data = data.filter((u) =>
        String(u[this.filterField] ?? '')
          .toLowerCase()
          .includes(term),
      );
    }

    this.usuariosFiltrados = data;

    this.totalPages = Math.max(1, Math.ceil(data.length / this.perPage));
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;

    const start = (this.currentPage - 1) * this.perPage;
    this.usuariosPagina = data.slice(start, start + this.perPage);
  }

  get rangeStart(): number {
    if (this.usuariosFiltrados.length === 0) return 0;
    return (this.currentPage - 1) * this.perPage + 1;
  }

  get rangeEnd(): number {
    return Math.min(
      this.currentPage * this.perPage,
      this.usuariosFiltrados.length,
    );
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.actualizarVista();
  }

  // ─── Acciones sobre usuarios ─────────────────────────────────
  toggleEstado(id: number): void {
    const u = this.usuarios.find((x) => x.id === id);
    if (u) u.activo = !u.activo;
    this.actualizarVista();
  }

  eliminarUsuario(id: number): void {
    const u = this.usuarios.find((x) => x.id === id);
    if (!u) return;
    if (confirm(`¿Eliminar a ${u.nombre} ${u.apellido}?`)) {
      this.usuarios = this.usuarios.filter((x) => x.id !== id);
      this.actualizarVista();
    }
  }

  editarUsuario(id: number): void {
    const u = this.usuarios.find((x) => x.id === id);
    if (!u) return;

    this.editForm.reset({
      id: u.id,
      nombre: u.nombre,
      apellido: u.apellido,
      matricula: u.matricula,
      telefono: u.telefono,
      email: u.email,
      direccion: u.direccion,
      rol: u.rol,
      activo: u.activo,
    });

    this.modalSubtitle = `ID #${u.id} · ${this.roles[u.rol] ?? '—'}`;
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  get estadoActivo(): boolean {
    return !!this.editForm.get('activo')!.value;
  }

  toggleEstadoModal(): void {
    const control = this.editForm.get('activo')!;
    control.setValue(!control.value);
  }

  cerrarModal(): void {
    this.isModalOpen = false;
    document.body.style.overflow = '';
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.cerrarModal();
  }

  guardarEdicion(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const value = this.editForm.value;
    const u = this.usuarios.find((x) => x.id === value.id);
    if (!u) return;

    u.nombre = String(value.nombre).trim();
    u.apellido = String(value.apellido).trim();
    u.matricula = String(value.matricula).trim();
    u.telefono = String(value.telefono).trim();
    u.email = String(value.email).trim();
    u.direccion = String(value.direccion).trim();
    u.rol = Number(value.rol);
    u.activo = Boolean(value.activo);

    this.cerrarModal();
    this.actualizarVista();
  }

  // ─── Popover de detalles ─────────────────────────────────────
  mostrarInfoPopover(id: number, event: MouseEvent): void {
    const yaAbiertoParaEsteUsuario =
      this.popoverVisible && this.popoverUsuario?.id === id;
    if (yaAbiertoParaEsteUsuario) {
      this.cerrarInfoPopover();
      return;
    }

    const u = this.usuarios.find((x) => x.id === id);
    if (!u) return;

    this.popoverUsuario = u;
    this.popoverVisible = true;

    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();

    // Se posiciona tras el render, cuando el popover ya tiene sus dimensiones reales
    setTimeout(() => {
      const pop = this.infoPopoverRef?.nativeElement;
      const popWidth = pop?.offsetWidth ?? 260;
      const popHeight = pop?.offsetHeight ?? 200;

      let left = rect.left;
      if (left + popWidth > window.innerWidth - 12)
        left = window.innerWidth - popWidth - 12;
      if (left < 12) left = 12;

      let top = rect.bottom + 8;
      if (top + popHeight > window.innerHeight - 12)
        top = rect.top - popHeight - 8;

      this.popoverLeft = left;
      this.popoverTop = top;
    });
  }

  cerrarInfoPopover(): void {
    this.popoverVisible = false;
    this.popoverUsuario = null;
  }

  onTableScroll(): void {
    this.cerrarInfoPopover();
  }

  // ─── Listeners globales ──────────────────────────────────────
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.popoverVisible) return;
    const target = event.target as HTMLElement;
    const pop = this.infoPopoverRef?.nativeElement;
    if (pop && pop.contains(target)) return;
    if (target.closest('[data-info-trigger]')) return;
    this.cerrarInfoPopover();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.cerrarModal();
    this.cerrarInfoPopover();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.cerrarInfoPopover();
  }
}

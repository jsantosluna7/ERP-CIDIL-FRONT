import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Usuarios } from '../../../../interfaces/usuarios.interface';
import { Rol, UsuarioService } from './usuarios.service';

/** Modelo simplificado que usa la vista (nombres cortos, fáciles de bindear en el HTML). */
interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  matricula: string;
  telefono: string;
  email: string;
  direccion: string;
  idRol: number;
  activo: boolean;
}

// El campo de filtro 'idRol' filtra por el NOMBRE del rol (vía nombreRol()),
// no por el número crudo, para que la búsqueda de texto tenga sentido.
type CampoFiltro = 'nombre' | 'apellido' | 'matricula' | 'email' | 'idRol';

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
export class UsuariosComponent implements OnInit {
  // ─── Catálogos ─────────────────────────────────────────────
  /** Se llena dinámicamente en cargarRoles() desde el endpoint obtenerRol(). */
  rolesOptions: Rol[] = [];

  readonly filtros: FiltroChip[] = [
    { field: 'nombre', label: 'Nombre' },
    { field: 'apellido', label: 'Apellido' },
    { field: 'matricula', label: 'Matrícula' },
    { field: 'email', label: 'Email' },
    { field: 'idRol', label: 'Rol' },
  ];

  // ─── Datos ─────────────────────────────────────────────────
  usuarios: Usuario[] = [];

  // ─── Estados de carga / acción en curso ─────────────────────
  loading = false;
  noData = false;
  guardando = false;
  eliminandoId: number | null = null;
  cambiandoEstadoId: number | null = null;

  // ─── Formulario reactivo: búsqueda / filtros / paginación ───
  filtrosForm: FormGroup;
  filterField: CampoFiltro = 'nombre';

  // ─── Formulario reactivo: edición de usuario ────────────────
  editForm: FormGroup;

  usuariosFiltrados: Usuario[] = [];
  usuariosPagina: Usuario[] = [];
  currentPage = 1;
  totalPages = 1;

  isModalOpen = false;
  modalSubtitle = '—';

  popoverVisible = false;
  popoverUsuario: Usuario | null = null;
  popoverTop = 0;
  popoverLeft = 0;

  @ViewChild('infoPopover') infoPopoverRef?: ElementRef<HTMLDivElement>;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private _toastr: ToastrService,
  ) {
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
      rol: [null as number | null, Validators.required],
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
  }

  ngOnInit(): void {
    this.cargarRoles();
    this.cargarUsuarios();
  }

  /** Devuelve el nombre legible de un rol a partir de su id numérico. */
  nombreRol(idRol: number): string {
    return this.rolesOptions.find((r) => r.id === idRol)?.nombre ?? '—';
  }

  // ─── Mapeo backend (Usuarios) ↔ modelo de vista (Usuario) ────
  private mapearUsuario(u: Usuarios): Usuario {
    return {
      id: u.id,
      nombre: u.nombreUsuario,
      apellido: u.apellidoUsuario,
      matricula: String(u.idMatricula),
      telefono: u.telefono,
      email: u.correoInstitucional,
      direccion: u.direccion,
      idRol: u.idRol,
      activo: u.activado ?? true,
    };
  }

  // ─── Obtención de datos ───────────────────────────────────────
  cargarRoles(): void {
    this.usuarioService.obtenerRol().subscribe({
      next: (roles: any[]) => {
        // Mapeo defensivo: acepta {id, nombre} o variantes tipo
        // {idRol, nombreRol}. Ajusta esto en cuanto confirmes el shape real.
        this.rolesOptions = (roles ?? []).map((r) => ({
          id: r.id ?? r.idRol,
          nombre: r.nombre ?? r.nombreRol ?? r.rol,
        }));
      },
      error: (err) => {
        this._toastr.error('No se pudieron cargar los roles.');
        console.error('Error al cargar roles:', err);
      },
    });
  }

  cargarUsuarios(): void {
    this.loading = true;

    this.usuarioService.obtenerUsuarios().subscribe({
      next: (respuesta) => {
        this.usuarios = (respuesta ?? []).map((u) => this.mapearUsuario(u));
        this.loading = false;
        this.noData = this.usuarios.length === 0;
        this.actualizarVista();
      },
      error: (err) => {
        this.loading = false;
        this.noData = true;
        this._toastr.error(
          err?.error?.error || 'No se pudo conectar con el servidor',
          'Error al cargar los usuarios',
        );
        console.error('Error al cargar usuarios:', err);
      },
    });
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

  // ─── Cálculo de tabla / paginación (en cliente, sobre los datos ya cargados) ───
  actualizarVista(): void {
    this.cerrarInfoPopover();

    let data: Usuario[] = this.usuarios;

    const term = this.searchTerm;
    if (term) {
      data = data.filter((u) => {
        const valor =
          this.filterField === 'idRol'
            ? this.nombreRol(u.idRol)
            : String(u[this.filterField] ?? '');
        return valor.toLowerCase().includes(term);
      });
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

  // ─── Acciones sobre usuarios (persistidas contra el backend) ─────────────
  toggleEstado(id: number): void {
    const u = this.usuarios.find((x) => x.id === id);
    if (!u || this.cambiandoEstadoId === id) return;

    const nuevoEstado = !u.activo;
    this.cambiandoEstadoId = id;

    this.usuarioService.desactivarUsuario(id, nuevoEstado).subscribe({
      next: () => {
        u.activo = nuevoEstado;
        this.cambiandoEstadoId = null;
        this._toastr.success(
          `Usuario ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`,
        );
        this.actualizarVista();
      },
      error: (err) => {
        this.cambiandoEstadoId = null;
        this._toastr.error('Error al actualizar el estado del usuario.');
        console.error('Error al cambiar estado:', err);
      },
    });
  }

  eliminarUsuario(id: number): void {
    const u = this.usuarios.find((x) => x.id === id);
    if (!u || this.eliminandoId === id) return;

    if (!confirm(`¿Eliminar a ${u.nombre} ${u.apellido} de forma PERMANENTE?`)) {
      return;
    }

    this.eliminandoId = id;

    this.usuarioService.eliminarUsuario(id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter((x) => x.id !== id);
        this.eliminandoId = null;
        this._toastr.success('Usuario eliminado correctamente.');
        this.actualizarVista();
      },
      error: (err) => {
        this.eliminandoId = null;
        this._toastr.error(
          err?.error?.error || '',
          'Error al eliminar el usuario',
        );
        console.error('Error al eliminar usuario:', err);
      },
    });
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
      rol: u.idRol,
      activo: u.activo,
    });

    this.modalSubtitle = `ID #${u.id} · ${this.nombreRol(u.idRol)}`;
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
    if (this.guardando) return;

    const value = this.editForm.value;
    const u = this.usuarios.find((x) => x.id === value.id);
    if (!u) return;

    // Payload en el formato que espera el backend (Usuarios), no el modelo de vista.
    // NOTA: `idMatricula` es `number` según tu interfaz; si tus matrículas incluyen
    // letras o guiones, este Number(...) va a devolver NaN — avísame si es el caso.
    const payload: Partial<Usuarios> = {
      nombreUsuario: String(value.nombre).trim(),
      apellidoUsuario: String(value.apellido).trim(),
      idMatricula: Number(value.matricula),
      telefono: String(value.telefono).trim(),
      correoInstitucional: String(value.email).trim(),
      direccion: String(value.direccion).trim(),
      idRol: Number(value.rol),
      activado: Boolean(value.activo),
    };

    this.guardando = true;

    this.usuarioService.actualizarUsuario(u.id, payload).subscribe({
      next: () => {
        u.nombre = String(value.nombre).trim();
        u.apellido = String(value.apellido).trim();
        u.matricula = String(value.matricula).trim();
        u.telefono = String(value.telefono).trim();
        u.email = String(value.email).trim();
        u.direccion = String(value.direccion).trim();
        u.idRol = Number(value.rol);
        u.activo = Boolean(value.activo);

        this.guardando = false;
        this._toastr.success('Usuario actualizado correctamente.');
        this.cerrarModal();
        this.actualizarVista();
      },
      error: (err) => {
        this.guardando = false;
        this._toastr.error(
          err?.error?.error || '',
          'Error al actualizar el usuario',
        );
        console.error('Error al actualizar usuario:', err);
      },
    });
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
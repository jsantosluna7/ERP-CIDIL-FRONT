/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  HttpClientModule,
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
// 🎯 Importaciones de Servicios (Asegúrate de que las rutas sean correctas)
import { LikeService } from '../likes.service';
import { AnuncioService } from '../anuncios.service';
import { AuthService } from '../services/auth.service';
import { ComentarioService } from '../comentarios.service';

// ------------------ INTERFACES ------------------
interface Comentario {
  id?: number;
  texto: string;
  nombreUsuario?: string;
  fecha?: string;
}

interface Curriculum {
  id: number;
  nombre: string;
  email: string;
  archivoUrl: string;
  anuncioId?: number;
}

interface Anuncio {
  id: number;
  titulo: string;
  descripcion: string;
  urlImagenes: string[];
  likes: number;
  comentarios: Comentario[];
  esPasantia: boolean;
  fechaPublicacion: string | Date;
  usuarioDioLike: boolean;
  curriculos: Curriculum[];
  expandido?: boolean;
  nombreUsuarioPublicador?: string;
}

// ------------------ COMPONENTE ------------------
@Component({
  selector: 'app-anuncios',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './anuncios.component.html',
  styleUrls: ['./anuncios.component.css'],
})
export class AnunciosComponent implements OnInit {
  anuncios: Anuncio[] = [];
  cargando = true;

  // --- Variables de Rol/Permisos ---
  rolActual = '';
  esSuperUsuario = false;
  esAdmin = false;
  esProfesor = false;
  esEstudiante = false;
  esExterno = false;
  esPersonalCidil = false;

  // --- Variables de Publicación/Edición ---
  anuncioAEditar: Anuncio | null = null;
  esModoEdicion: boolean = false;
  nuevoAnuncioTexto = '';
  nuevoAnuncioDescripcion = '';
  nuevoAnuncioEsPasantia = false;
  nuevasImagenes: File[] = [];
  imagenesPreview: string[] = [];
  mensajeExitoPublicar: string | null = null;
  mensajeErrorPublicar: string | null = null;

  // --- Variables de Interacción (Likes/Comentarios/CV) ---
  todosCurriculos: Curriculum[] = [];
  curriculos: Record<number, File | null> = {};
  nombreExterno: Record<number, string> = {};
  correoExterno: Record<number, string> = {};
  mensajeExitoCurriculo: Record<number, string | null> = {};
  mensajeErrorCurriculo: Record<number, string | null> = {};
  curriculoOpen: Record<number, boolean> = {};
  nuevoComentario: Record<number, string> = {};
  procesandoLike: Record<number, boolean> = {};
  carpetaExpandida = false;

  private readonly baseUrl = 'http://localhost:5006/api';
  public readonly imagenBaseUrl = 'http://localhost:5006/';

  constructor(
    public authService: AuthService,
    private http: HttpClient,
    private likeService: LikeService,
    private anuncioService: AnuncioService,
    private comentarioService: ComentarioService,
    public router: Router
  ) {}

  // =========================== CICLO DE VIDA ===========================
  async ngOnInit(): Promise<void> {
    this.calcularRoles();
    await this.cargarAnuncios();
    if (this.puedeVerCurriculos()) await this.cargarTodosCurriculos();
  }

  // =========================== LÓGICA DE ROLES Y PERMISOS ===========================
  calcularRoles(): void {
    if (!this.authService.isAuthenticated()) {
      this.rolActual = 'EXTERNO';
      this.esExterno = true;
      return;
    }

    const rolRaw = this.authService.getRole()?.toUpperCase() ?? 'EXTERNO';
    this.rolActual = rolRaw;

    this.esSuperUsuario = rolRaw === 'SUPERUSUARIO' || rolRaw === '1';
    this.esAdmin = rolRaw === 'ADMINISTRADOR' || rolRaw === '2';
    this.esProfesor = rolRaw === 'PROFESOR' || rolRaw === '3';
    this.esEstudiante = rolRaw === 'ESTUDIANTE' || rolRaw === '4';
    this.esPersonalCidil = rolRaw === 'PERSONALCIDIL' || rolRaw === '5';

    this.esExterno = !(
      this.esSuperUsuario ||
      this.esAdmin ||
      this.esProfesor ||
      this.esEstudiante ||
      this.esPersonalCidil
    );
  }

  puedePublicar(): boolean {
    return this.esSuperUsuario || this.esAdmin || this.esPersonalCidil;
  }

  puedeEditar(): boolean {
    return this.puedePublicar();
  }

  puedeVerCurriculos(): boolean {
    return this.esSuperUsuario || this.esAdmin || this.esPersonalCidil;
  }

  puedeSubirCurriculo(): boolean {
    return this.esProfesor || this.esEstudiante || this.esExterno;
  }

  puedeComentarYDarLike(): boolean {
    return this.esProfesor || this.esEstudiante;
  }

  private getHeaders(): HttpHeaders | undefined {
    const token = this.authService.getToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
  }

  // =========================== ANUNCIOS ===========================
  async cargarAnuncios(): Promise<void> {
    this.cargando = true;
    try {
      const data: any[] = await lastValueFrom(this.anuncioService.obtenerTodos());

      // Asegurarse de que imagenBaseUrl termine con '/'
      const baseUrl = this.imagenBaseUrl.endsWith('/') ? this.imagenBaseUrl : `${this.imagenBaseUrl}/`;

      // Mapear anuncios y construir urlImagenes correctamente
      this.anuncios = (data ?? []).map((a) => {
        // a.imagenUrl puede llegar como string con separador ';' o null/undefined
        const raw = a.imagenUrl ?? '';
        const urls = raw
          .toString()
          .split(';')
          .map((u: string) => u.trim())
          .filter((u: string) => u && u.length > 0)
          .map((u: string) => {
            if (u.startsWith('http')) return u;
            // eliminar slashes iniciales si los tiene y concatenar base
            const rutaLimpia = u.replace(/^\/+/, '');
            return `${baseUrl}${rutaLimpia}`;
          });

        return {
          id: a.id,
          titulo: a.titulo ?? '',
          descripcion: a.descripcion ?? '',
          nombreUsuarioPublicador: a.nombreUsuario ?? 'Autor Desconocido',
          urlImagenes: urls,
          likes: 0,
          comentarios: [],
          esPasantia: a.esPasantia ?? false,
          fechaPublicacion: a.fechaPublicacion ?? '',
          usuarioDioLike: false,
          curriculos: [],
          expandido: false,
        } as Anuncio;
      });

      // Cargar likes y comentarios (y curriculos si aplica)
      for (const anuncio of this.anuncios) {
        await Promise.all([this.cargarComentarios(anuncio), this.cargarLikes(anuncio)]);
        if (this.puedeVerCurriculos()) await this.cargarCurriculos(anuncio);
      }
    } catch (err) {
      console.error('Error al cargar anuncios:', err);
      this.anuncios = [];
    } finally {
      this.cargando = false;
    }
  }

  private reiniciarFormularioAnuncio(): void {
    this.nuevoAnuncioTexto = '';
    this.nuevoAnuncioDescripcion = '';
    this.nuevoAnuncioEsPasantia = false;
    this.nuevasImagenes = [];
    this.imagenesPreview = [];
    this.mensajeExitoPublicar = null;
    this.mensajeErrorPublicar = null;
    this.anuncioAEditar = null;
    this.esModoEdicion = false;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  abrirModalPublicar(): void {
    this.reiniciarFormularioAnuncio();
    const modalElement = document.getElementById('modalPublicar');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  cerrarModalPublicar(): void {
    const modalElement = document.getElementById('modalPublicar');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  manejarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.nuevasImagenes = Array.from(input.files);
    this.imagenesPreview = [];

    this.nuevasImagenes.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string | null;
        if (result) this.imagenesPreview.push(result);
      };
      reader.readAsDataURL(file);
    });
  }

  editarAnuncio(anuncio: Anuncio): void {
    if (!this.puedeEditar()) return;

    this.reiniciarFormularioAnuncio();

    this.esModoEdicion = true;
    this.anuncioAEditar = anuncio;

    this.nuevoAnuncioTexto = anuncio.titulo;
    this.nuevoAnuncioDescripcion = anuncio.descripcion;
    this.nuevoAnuncioEsPasantia = !!anuncio.esPasantia;

    const modalElement = document.getElementById('modalPublicar');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  publicarAnuncio(): void {
    if (!this.puedePublicar()) {
      this.mensajeErrorPublicar = 'Permisos insuficientes para publicar/editar.';
      return;
    }
    if (!this.nuevoAnuncioTexto.trim() || !this.nuevoAnuncioDescripcion.trim()) {
      this.mensajeErrorPublicar = 'Faltan campos obligatorios (Título/Descripción).';
      return;
    }

    const formData = new FormData();
    formData.append('Titulo', this.nuevoAnuncioTexto.trim());
    formData.append('Descripcion', this.nuevoAnuncioDescripcion.trim());
    formData.append('EsPasantia', String(this.nuevoAnuncioEsPasantia));
    this.nuevasImagenes.forEach((img) => formData.append('Imagenes', img, img.name));

    this.mensajeErrorPublicar = null;

    if (this.esModoEdicion && this.anuncioAEditar?.id) {
      // MODO EDICIÓN
      this.anuncioService.editarAnuncio(this.anuncioAEditar.id, formData).subscribe({
        next: async (res: any) => {
          this.mensajeExitoPublicar = res?.mensaje ?? 'Anuncio actualizado correctamente ✅';
          await this.cargarAnuncios();
          setTimeout(() => this.cerrarModalPublicar(), 1500);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.mensajeErrorPublicar = err?.error?.error ?? 'Error al actualizar el anuncio.';
          this.mensajeExitoPublicar = null;
        },
      });
    } else {
      // MODO CREACIÓN
      this.anuncioService.crearAnuncio(formData).subscribe({
        next: async (res: any) => {
          this.mensajeExitoPublicar = res?.mensaje ?? 'Anuncio publicado correctamente ✅';
          await this.cargarAnuncios();
          setTimeout(() => {
            this.cerrarModalPublicar();
            this.reiniciarFormularioAnuncio();
          }, 1500);
        },
        error: (err) => {
          console.error('Error al publicar:', err);
          this.mensajeErrorPublicar = err?.error?.error ?? 'Error al publicar el anuncio.';
          this.mensajeExitoPublicar = null;
        },
      });
    }
  }

  eliminarAnuncio(anuncio: Anuncio): void {
    if (!confirm('¿Deseas eliminar este anuncio?')) return;
    this.anuncioService.eliminarAnuncio(anuncio.id).subscribe({
      next: async () => await this.cargarAnuncios(),
      error: (err) => console.error(err),
    });
  }

  // =========================== COMENTARIOS ===========================
  async cargarComentarios(anuncio: Anuncio): Promise<void> {
    try {
      const response: any = await lastValueFrom(this.comentarioService.obtenerPorAnuncio(anuncio.id));
      const data = response?.valor ?? response ?? [];

      anuncio.comentarios = (data as any[]).map((c: any) => ({
        id: c.id,
        texto: c.texto,
        nombreUsuario: c.nombreUsuario ?? c.nombre ?? 'Usuario Desconocido',
        fecha: c.fecha ? new Date(c.fecha).toISOString() : '',
      }));
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      anuncio.comentarios = [];
    }
  }

  publicarComentario(anuncio: Anuncio): void {
    const texto = (this.nuevoComentario[anuncio.id] ?? '').trim();

    if (!this.puedeComentarYDarLike()) {
      console.warn('Debes iniciar sesión con una cuenta de Profesor o Estudiante para comentar.');
      return;
    }

    if (!texto) return;

    this.comentarioService.crearComentario(anuncio.id, texto).subscribe({
      next: async () => {
        this.nuevoComentario[anuncio.id] = '';
        try {
          await this.cargarComentarios(anuncio);
        } catch (e) {
          console.warn('Advertencia: no se pudieron recargar los comentarios inmediatamente.', e);
        }
      },
      error: (err: any) => {
        console.error('Error al publicar comentario (detalle):', err);

        if (err?.status === 401) {
          console.warn('No autenticado. Por favor inicia sesión.');
          return;
        }
        if (err?.status === 403) {
          console.warn('No tienes permisos para comentar. Debes ser Profesor o Estudiante.');
          return;
        }

        const msg = (err?.error?.error || err?.message || '').toString();
        if (msg.toLowerCase().includes('usuario no autenticado') || msg.toLowerCase().includes('id no encontrado')) {
          console.warn('Debes iniciar sesión con una cuenta de Profesor o Estudiante para comentar.');
          return;
        }

        console.warn('Error al enviar el comentario. Intenta nuevamente.');
      },
    });
  }

  // =========================== LIKES ===========================
  async cargarLikes(anuncio: Anuncio): Promise<void> {
    try {
      const res: any = await lastValueFrom(this.likeService.contarLikes(anuncio.id));
      anuncio.likes = res?.totalLikes ?? 0;
      anuncio.usuarioDioLike = res?.usuarioDioLike ?? false;
    } catch {
      anuncio.likes = 0;
      anuncio.usuarioDioLike = false;
    }
  }

  darLike(anuncio: Anuncio): void {
    if (!this.puedeComentarYDarLike() || this.procesandoLike[anuncio.id]) return;
    this.procesandoLike[anuncio.id] = true;

    this.likeService.darLike(anuncio.id, this.authService.getEmail() ?? 'anonimo').subscribe({
      next: (res: any) => {
        anuncio.likes = res?.totalLikes ?? anuncio.likes;
        anuncio.usuarioDioLike = res?.usuarioDioLike ?? !anuncio.usuarioDioLike;
      },
      error: (err) => console.error(err),
      complete: () => (this.procesandoLike[anuncio.id] = false),
    });
  }

  // =========================== CURRÍCULOS ===========================
  async cargarCurriculos(anuncio: Anuncio): Promise<void> {
    try {
      const data = await lastValueFrom(this.http.get<Curriculum[]>(`${this.baseUrl}/Curriculum`, { headers: this.getHeaders() }));
      const baseUrl = this.imagenBaseUrl.endsWith('/') ? this.imagenBaseUrl : `${this.imagenBaseUrl}/`;

      anuncio.curriculos =
        data
          ?.filter((c) => c.anuncioId === anuncio.id)
          .map((c) => ({
            ...c,
            archivoUrl: `${baseUrl}${c.archivoUrl.replace(/^\/+/, '')}`,
          })) ?? [];
    } catch {
      anuncio.curriculos = [];
    }
  }

  async cargarTodosCurriculos(): Promise<void> {
    try {
      const data = await lastValueFrom(this.http.get<Curriculum[]>(`${this.baseUrl}/Curriculum`, { headers: this.getHeaders() }));
      const baseUrl = this.imagenBaseUrl.endsWith('/') ? this.imagenBaseUrl : `${this.imagenBaseUrl}/`;

      this.todosCurriculos = data?.map((c) => ({ ...c, archivoUrl: `${baseUrl}${c.archivoUrl.replace(/^\/+/, '')}` })) ?? [];
    } catch {
      this.todosCurriculos = [];
    }
  }

  manejarCurriculo(event: Event, anuncioId: number): void {
    const input = event.target as HTMLInputElement;
    this.curriculos[anuncioId] = input.files?.[0] ?? null;
  }

  toggleCurriculoForm(anuncioId: number): void {
    this.curriculoOpen[anuncioId] = !this.curriculoOpen[anuncioId];
    if (this.curriculoOpen[anuncioId]) {
      this.mensajeExitoCurriculo[anuncioId] = null;
      this.mensajeErrorCurriculo[anuncioId] = null;
    }
  }

  async subirCurriculo(anuncio: Anuncio): Promise<void> {
    if (!this.curriculos[anuncio.id]) return;

    const formData = new FormData();
    formData.append('Archivo', this.curriculos[anuncio.id]!);

    if (this.esExterno) {
      const nombre = this.nombreExterno[anuncio.id]?.trim();
      const correo = this.correoExterno[anuncio.id]?.trim();
      if (!nombre || !correo) {
        this.mensajeErrorCurriculo[anuncio.id] = 'Nombre y correo son obligatorios.';
        return;
      }
      formData.append('Nombre', nombre);
      formData.append('Email', correo);
    }

    formData.append('AnuncioId', String(anuncio.id));

    try {
      const opciones: any = this.esExterno ? {} : { headers: this.getHeaders() };
      const res: any = await lastValueFrom(this.http.post(`${this.baseUrl}/Curriculum`, formData, opciones));

      this.mensajeExitoCurriculo[anuncio.id] = res?.mensaje ?? 'Currículum subido ✅';
      this.mensajeErrorCurriculo[anuncio.id] = null;
      await this.cargarCurriculos(anuncio);

      this.curriculos[anuncio.id] = null;
      this.nombreExterno[anuncio.id] = '';
      this.correoExterno[anuncio.id] = '';
      setTimeout(() => {
        this.toggleCurriculoForm(anuncio.id);
        this.mensajeExitoCurriculo[anuncio.id] = null;
      }, 3000);
    } catch (err: any) {
      console.error('Error al subir currículum:', err);
      this.mensajeErrorCurriculo[anuncio.id] = err?.error?.error ?? 'Error al subir currículum.';
      this.mensajeExitoCurriculo[anuncio.id] = null;
    }
  }

  verCurriculo(c: Curriculum): void {
    if (c?.archivoUrl) window.open(c.archivoUrl, '_blank');
  }

  descargarCurriculo(c: Curriculum): void {
    if (!c?.archivoUrl) return;
    // Descargar usando un enlace temporal para forzar la descarga
    const link = document.createElement('a');
    link.href = c.archivoUrl;
    // Si el archivo proviene del backend con CORS y Content-disposition, puede requerir otra estrategia.
    link.setAttribute('target', '_blank');
    // Nombre de archivo sugerido
    link.download = c.nombre ?? 'curriculum.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  eliminarCurriculo(c: Curriculum): void {
    if (!confirm('¿Deseas eliminar este currículum?')) return;
    this.http.delete(`${this.baseUrl}/Curriculum/${c.id}`, { headers: this.getHeaders() }).subscribe({
      next: async () => {
        this.todosCurriculos = this.todosCurriculos.filter((x) => x.id !== c.id);
        this.anuncios.forEach((a) => {
          a.curriculos = a.curriculos.filter((x) => x.id !== c.id);
        });
      },
      error: (err) => console.error(err),
    });
  }

  trackById(index: number, item: any): number {
    return item.id;
  }

  esCurriculoInvalido(anuncioId: number): boolean {
    if (!this.curriculos || !this.curriculos[anuncioId]) {
      return true;
    }

    if (this.esExterno) {
      const nombre = this.nombreExterno?.[anuncioId]?.trim();
      const correo = this.correoExterno?.[anuncioId]?.trim();
      if (!nombre || !correo) {
        return true;
      }
    }

    return false;
  }
}

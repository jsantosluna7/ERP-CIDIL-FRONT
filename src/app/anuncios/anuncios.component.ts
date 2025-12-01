import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core'; // Agregamos AfterViewInit y ElementRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  HttpClientModule,
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
// Importa la clase Dropdown de Bootstrap (asegúrate de que 'bootstrap' esté instalado)
import { Dropdown } from 'bootstrap'; 

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

export interface Curriculum {
  id: number;
  nombre: string;
  email: string;
  archivoUrl: string;
  anuncioId?: number;
  fechaPostulacion?: string;
}

interface Anuncio {
  id: number;
  titulo: string;
  descripcion: string;
  urlImagenes: string[];
  likes: number;
  comentarios: Comentario[];
  esPasantia: boolean;
  esCarrusel: boolean; // 🎯 PROPIEDAD PARA EL CARRUSEL
  fechaPublicacion: string | Date;
  usuarioDioLike: boolean;
  curriculos: Curriculum[];
  expandido?: boolean; // Se mantiene para la lista interna de CVs
  // ✅ CORRECCIÓN: Nueva propiedad para controlar la expansión de la tarjeta
  expandedContent?: boolean;
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
export class AnunciosComponent implements OnInit, AfterViewInit { // Implementamos AfterViewInit
  anuncios: Anuncio[] = [];
  cargando = true;

  anunciosFiltrados: Anuncio[] = [];

  anunciosCarrusel: Anuncio[] = [];

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
  nuevoAnuncioEsCarrusel = false; // 🎯 PROPIEDAD para el modal
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

  private readonly baseUrl = 'http://localhost:5006/api';
  public readonly imagenBaseUrl = 'http://localhost:5006/';

  constructor(
    public authService: AuthService,
    private http: HttpClient,
    private likeService: LikeService,
    private anuncioService: AnuncioService,
    private comentarioService: ComentarioService,
    public router: Router,
    private elementRef: ElementRef // Inyectamos ElementRef
  ) {}

  /**
   * ✅ CORRECCIÓN: Se renombra el getter para que no coincida con el nombre
   * de una plantilla (<ng-template #sinAnuncios>) y evitar el error
   * 'boolean is not assignable to TemplateRef'.
   * Este getter devuelve un BOOLEAN (si hay anuncios).
   */
  get hayAnunciosParaMostrar(): boolean {
    // Si la lista de anuncios filtrados tiene elementos, es TRUE.
    return this.anunciosFiltrados.length > 0;
  }

  // =========================== CICLO DE VIDA ===========================
  async ngOnInit(): Promise<void> {
    this.calcularRoles();
    await this.cargarAnuncios();
    // 🎯 Al iniciar, solo mostramos los anuncios que NO son de carrusel por defecto.
    this.anunciosFiltrados = this.anuncios.filter(a => a.esCarrusel === false);
    if (this.puedeVerCurriculos()) {
      await this.cargarTodosCurriculos();
    }
  }

  // 🔥 NUEVO: Método llamado después de que la vista se ha inicializado
  ngAfterViewInit(): void {
      this.inicializarDropdownEstatico();
  }

  // =========================== INICIALIZACIÓN DE DROPDOWNS BOOTSTRAP ===========================

  /**
   * Inicializa el dropdown estático de la "Carpeta de Currículos" después de que se cargue la vista.
   * Nota: Este no se genera con *ngFor, pero se inicializa aquí por si es necesario.
   */
  inicializarDropdownEstatico(): void {
      const dropdownEl = this.elementRef.nativeElement.querySelector('#curriculumCollapse .dropdown button[data-bs-toggle="dropdown"]');
      if (dropdownEl) {
          // Inicializa el dropdown estático si existe
          new Dropdown(dropdownEl);
      }
  }

  /**
   * Inicializa manualmente el Dropdown de Bootstrap cuando se hace clic en un botón.
   * Esto soluciona el problema de los elementos generados dinámicamente con *ngFor.
   * @param event El evento de click para obtener el elemento del botón.
   */
  inicializarDropdownDinamico(event: Event): void {
      const button = event.currentTarget as HTMLElement;
      if (button) {
          // Inicializa y luego llama a toggle() para abrirlo
          const dropdownInstance = new Dropdown(button);
          // Opcionalmente, puedes forzar el toggle aquí si el data-bs-toggle='dropdown' no lo hace:
          // dropdownInstance.toggle();
      }
  }
  // ==========================================================================================

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

  // Función para mostrar la CARPETA de CVs
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

      const baseUrl = this.imagenBaseUrl.endsWith('/') ? this.imagenBaseUrl : `${this.imagenBaseUrl}/`;

      this.anuncios = (data ?? []).map((a) => {
        const raw = a.imagenUrl ?? '';
        const urls = raw
          .toString()
          .split(';')
          .map((u: string) => u.trim())
          .filter((u: string) => u && u.length > 0)
          .map((u: string) => {
            if (u.startsWith('http')) return u;
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
          esCarrusel: a.esCarrusel ?? false, // Mapear la nueva propiedad
          fechaPublicacion: a.fechaPublicacion ?? '',
          usuarioDioLike: false,
          curriculos: a.curriculos ?? [],
          expandido: false,
          expandedContent: false, // Inicializar la nueva propiedad
        } as Anuncio;
      });

      // Cargar likes y comentarios (y curriculos específicos del anuncio si aplica)
      for (const anuncio of this.anuncios) {
        await Promise.all([this.cargarComentarios(anuncio), this.cargarLikes(anuncio)]);
        // Ya no cargamos curriculosPorAnuncio aquí, lo haremos a partir de la lista global
      }

      // 🎯 MODIFICACIÓN: Filtrar para el carrusel (solo anuncios marcados y con imágenes).
      this.anunciosCarrusel = this.anuncios.filter(a => a.esCarrusel === true && a.urlImagenes.length > 0);

      // 🎯 Inicializar anunciosFiltrados para mostrar SÓLO los que NO son carrusel
      this.anunciosFiltrados = this.anuncios.filter(a => a.esCarrusel === false);

      // Si el usuario puede ver currículos, cargar la lista global y luego actualizar los anuncios
      if (this.puedeVerCurriculos()) {
        await this.cargarTodosCurriculos();
        this.anuncios.forEach(anuncio => this.actualizarCurriculosEnAnuncio(anuncio));
      }


    } catch (err) {
      console.error('Error al cargar anuncios:', err);
      this.anuncios = [];
      this.anunciosFiltrados = [];
      this.anunciosCarrusel = [];
    } finally {
      this.cargando = false;
    }
  }

  /**
   * Filtra la lista de anuncios mostrada según la categoría seleccionada en las tarjetas.
   * La lista principal solo debe incluir anuncios que NO sean de carrusel.
   * @param categoria El nombre de la categoría ('Pasantía', 'Investigación', 'Evento', 'General').
   */
  filtrarPor(categoria: string): void {
    console.log(`Filtro seleccionado: ${categoria}`);

    // 🎯 1. Obtener la lista base: SÓLO anuncios que NO son de carrusel.
    const baseList = this.anuncios.filter(a => a.esCarrusel === false);

    switch (categoria) {
      case 'Pasantía':
        this.anunciosFiltrados = baseList.filter(a => a.esPasantia === true);
        break;
      case 'Investigación':
        // Asume que la descripción o el título debe contener esta palabra
        this.anunciosFiltrados = baseList.filter(a => a.descripcion.toLowerCase().includes('investigación') || a.titulo.toLowerCase().includes('investigación'));
        break;
      case 'Evento':
        this.anunciosFiltrados = baseList.filter(a => a.descripcion.toLowerCase().includes('evento') || a.titulo.toLowerCase().includes('evento'));
        break;
      case 'General':
        // Muestra todos los que no son carrusel
        this.anunciosFiltrados = baseList;
        break;
      default:
        this.anunciosFiltrados = baseList;
        break;
    }
  }

  private reiniciarFormularioAnuncio(): void {
    this.nuevoAnuncioTexto = '';
    this.nuevoAnuncioDescripcion = '';
    this.nuevoAnuncioEsPasantia = false;
    this.nuevoAnuncioEsCarrusel = false; // 🎯 Reiniciar
    this.nuevasImagenes = [];
    this.imagenesPreview = [];
    this.mensajeExitoPublicar = null;
    this.mensajeErrorPublicar = null;
    this.anuncioAEditar = null;
    this.esModoEdicion = false;
    const fileInput = document.getElementById('fileInputModal') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  // --- Lógica de Modales y CRUD de Anuncios ---

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
    this.reiniciarFormularioAnuncio(); // Asegurar reinicio al cerrar
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
    this.nuevoAnuncioEsCarrusel = !!anuncio.esCarrusel; // Cargar valor para edición

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
    formData.append('EsCarrusel', String(this.nuevoAnuncioEsCarrusel)); // AÑADIR AL FORMDATA
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

  // --- Lógica de Comentarios y Likes ---

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
        const msg = (err?.error?.error || err?.message || '').toString();
        if (msg.toLowerCase().includes('usuario no autenticado') || msg.toLowerCase().includes('id no encontrado') || err?.status === 401 || err?.status === 403) {
          console.warn('No tienes permisos para comentar. Debes ser Profesor o Estudiante y estar autenticado.');
          return;
        }
        console.warn('Error al enviar el comentario. Intenta nuevamente.');
      },
    });
  }

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

  // =========================== LÓGICA DE CURRÍCULOS (CORREGIDA) ===========================

  /**
   * Carga la lista global de currículos para mostrar en el panel lateral (solo para roles con permiso).
   */
  async cargarTodosCurriculos(): Promise<void> {
    if (!this.puedeVerCurriculos()) {
      this.todosCurriculos = [];
      return;
    }

    try {
      // 1. Obtener todos los CVs del backend
      const data = await lastValueFrom(this.http.get<Curriculum[]>(`${this.baseUrl}/Curriculum`, { headers: this.getHeaders() }));
      const baseUrl = this.imagenBaseUrl.endsWith('/') ? this.imagenBaseUrl : `${this.imagenBaseUrl}/`;

      // 2. Mapear los datos y construir la URL del archivo
      this.todosCurriculos = (data ?? [])
        .map((c: any) => ({
          id: c.id,
          nombre: c.nombre,
          email: c.email,
          // ✅ CORRECCIÓN: Construir la URL completa para la descarga
          archivoUrl: `${baseUrl}${c.archivoUrl.replace(/^\/+/, '')}`,
          anuncioId: c.anuncioId,
          fechaPostulacion: c.fechaSubida,
        }))
        .sort((a, b) => new Date(b.fechaPostulacion!).getTime() - new Date(a.fechaPostulacion!).getTime()); // Ordenar por fecha

    } catch (error) {
      console.error('Error al cargar todos los currículos:', error);
      this.todosCurriculos = [];
    }
  }

  /**
   * Actualiza la propiedad `curriculos` de un anuncio a partir de la lista global.
   * Se usa para actualizar la vista después de cargar o eliminar un CV.
   * @param anuncio El anuncio a actualizar.
   */
  actualizarCurriculosEnAnuncio(anuncio: Anuncio): void {
    if (!this.puedeVerCurriculos()) return;

    // Reutiliza la lista global, y luego filtra por el ID del anuncio
    anuncio.curriculos =
      this.todosCurriculos
        .filter((c: Curriculum) => c.anuncioId === anuncio.id) // Aquí SÍ debe filtrar por anuncioId
        .map((c) => ({ ...c })) ?? []; // Copia para no modificar el objeto de la lista global
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
    if (this.esCurriculoInvalido(anuncio.id)) {
      this.mensajeErrorCurriculo[anuncio.id] = 'Debe seleccionar un archivo y completar los campos de nombre/correo si es externo.';
      return;
    }

    const formData = new FormData();
    // Usamos el operador de aserción no nula '!' aquí porque la validación esCurriculoInvalido nos garantiza que el archivo existe.
    formData.append('Archivo', this.curriculos[anuncio.id]!);
    formData.append('AnuncioId', String(anuncio.id));

    // INICIO DE LA CORRECCIÓN: Asegurar que el nombre y correo se envíen para todos los roles
    let nombrePostulante: string;
    let emailPostulante: string;

    if (this.esExterno) {
      // Para externos: usa los campos del formulario
      nombrePostulante = this.nombreExterno[anuncio.id] ?? '';
      emailPostulante = this.correoExterno[anuncio.id] ?? '';
    } else {
      // Para autenticados (Estudiante/Profesor): usa los datos del AuthService.
      emailPostulante = this.authService.getEmail() ?? 'no_email@example.com';

      // ✅ CORRECCIÓN CLAVE: Usar getUserName() para obtener el nombre real.
      nombrePostulante = this.authService.getUserName() ?? 'Usuario Autenticado';
    }

    // Doble verificación (debería estar cubierto por esCurriculoInvalido)
    if (!nombrePostulante.trim() || !emailPostulante.trim()) {
      this.mensajeErrorCurriculo[anuncio.id] = 'Falta el nombre o correo del postulante.';
      return;
    }

    formData.append('Nombre', nombrePostulante);
    formData.append('Email', emailPostulante);

    try {
      // Si el usuario es externo, no enviamos el header de autenticación.
      const opciones: any = this.esExterno ? {} : { headers: this.getHeaders() };
      const res: any = await lastValueFrom(this.http.post(`${this.baseUrl}/Curriculum`, formData, opciones));

      this.mensajeExitoCurriculo[anuncio.id] = res?.mensaje ?? 'Currículum subido ✅';
      this.mensajeErrorCurriculo[anuncio.id] = null;

      if (this.puedeVerCurriculos()) {
        // Recargar ambas listas para que se vean los cambios
        await this.cargarTodosCurriculos();
        this.actualizarCurriculosEnAnuncio(anuncio); // Usar la función de actualización
      }

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

  descargarCurriculo(c: Curriculum): void {
    if (!c?.archivoUrl) return;
    window.open(c.archivoUrl, '_blank');
  }

  /**
   * Elimina un currículum desde la vista de un anuncio específico.
   * @param c El objeto Curriculum a eliminar.
   * @param anuncio El anuncio al que pertenece.
   */
  eliminarCurriculo(c: Curriculum, anuncio: Anuncio): void {
    if (!this.puedeVerCurriculos()) return;
    if (!confirm(`¿Deseas eliminar el currículum de ${c.nombre}?`)) return;

    this.http.delete(`${this.baseUrl}/Curriculum/${c.id}`, { headers: this.getHeaders() }).subscribe({
      next: async () => {
        // ✅ CORRECCIÓN: Actualizar la lista interna del anuncio
        anuncio.curriculos = anuncio.curriculos.filter((x) => x.id !== c.id);
        // Recargar la lista global para que se elimine de la carpeta lateral
        await this.cargarTodosCurriculos();
      },
      error: (err) => console.error('Error al eliminar currículum:', err),
    });
  }

  /**
   * ✅ FUNCIÓN para eliminar un currículum desde la carpeta lateral global.
   * @param c El objeto Curriculum a eliminar.
   */
  eliminarCurriculoGlobal(c: Curriculum): void {
    if (!this.puedeVerCurriculos()) return;
    if (!confirm(`¿Deseas eliminar el currículum de ${c.nombre} de la carpeta global?`)) return;

    this.http.delete(`${this.baseUrl}/Curriculum/${c.id}`, { headers: this.getHeaders() }).subscribe({
      next: async () => {
        // ✅ CORRECCIÓN: Eliminar de la lista global
        this.todosCurriculos = this.todosCurriculos.filter((x) => x.id !== c.id);

        // Recargar todos los anuncios para actualizar las listas internas de CV
        // (Llamamos a cargarAnuncios para asegurar la consistencia total)
        await this.cargarAnuncios();
      },
      error: (err) => console.error('Error al eliminar currículum global:', err),
    });
  }

  trackById(index: number, item: any): number {
    return item.id;
  }

  esCurriculoInvalido(anuncioId: number): boolean {
    if (!this.curriculos || !this.curriculos[anuncioId]) {
      return true; // No hay archivo adjunto
    }

    if (this.esExterno) {
      const nombre = this.nombreExterno?.[anuncioId]?.trim();
      const correo = this.correoExterno?.[anuncioId]?.trim();
      // Validación básica de correo
      const esCorreoValido = correo && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
      if (!nombre || !esCorreoValido) {
        return true; // Faltan nombre o correo válidos para externo
      }
    }

    // Para usuarios autenticados (Profesor/Estudiante)
    if (!this.esExterno) {
      if (!this.authService.getEmail() || !this.authService.getUserName()) {
        // Esto solo debería pasar si los datos del usuario no están disponibles al momento de postular
        console.warn('Falta correo o nombre para usuario autenticado. Revisar token.');
        return true;
      }
    }

    return false;
  }

  /**
   * Cambia el estado 'expandido' del anuncio para mostrar u ocultar la lista de CVs en la UI.
   */
  toggleCurriculos(anuncio: Anuncio): void {
    anuncio.expandido = !anuncio.expandido;
  }
}
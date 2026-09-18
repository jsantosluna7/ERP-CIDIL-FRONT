import { Component, OnInit, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NoticiaVM,
  PublicacionService,
} from '../../../services/publicacion.service';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-publicacion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './publicacion.component.html',
  styleUrls: ['./publicacion.component.css'],
})
export class PublicacionComponent implements OnInit {
  anuncios: any[] = [];
  anunciosCarrusel: any[] = [];
  anuncioActual: any = null;
  indiceCarrusel = 0;

  // Noticias (IEESL / Tecnología) traídas de la API
  noticias = signal<NoticiaVM[]>([]);

  // Noticia abierta en el modal de detalle
  noticiaSeleccionada = signal<NoticiaVM | null>(null);

  laboratorioSeleccionado: any = null;

  abrirLab(lab: any): void {
    this.laboratorioSeleccionado = lab;
  }

  cerrarLab(): void {
    this.laboratorioSeleccionado = null;
  }

  abrirNoticia(noticia: NoticiaVM): void {
    this.noticiaSeleccionada.set(noticia);
  }

  cerrarNoticia(): void {
    this.noticiaSeleccionada.set(null);
  }

  /**
   * Hace scroll a una sección dentro de la misma página.
   * No se usa href="#id" porque el Router de Angular intercepta esos
   * clics como navegación y termina re-evaluando las rutas raíz
   * (lo que producía la redirección indebida a /login o /home).
   */
  irASeccion(id: string, event: Event): void {
    event.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Estado del botón "volver arriba" — se muestra cuando el usuario ha bajado
  mostrarVolverArriba = false;

  // Estado del header al hacer scroll — sombra más profunda cuando no está arriba
  headerConScroll = false;

  // Escucha global de scroll: actualiza la barra de progreso y la visibilidad del botón
  @HostListener('window:scroll')
  onScroll(): void {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const alturaTotal = doc.scrollHeight - doc.clientHeight;
    const progreso = alturaTotal > 0 ? (scrollTop / alturaTotal) * 100 : 0;

    // Actualiza la barra de progreso vía variable CSS (sin re-renderizar Angular)
    document.documentElement.style.setProperty(
      '--reading-progress',
      `${progreso}%`,
    );

    // Botón visible después de bajar más de una pantalla
    this.mostrarVolverArriba = scrollTop > 480;

    // Header con sombra cuando el usuario ha bajado
    this.headerConScroll = scrollTop > 10;
  }

  volverArriba(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Carrusel deslizable de noticias — muestra 4 tarjetas a la vez, se desplaza de una en una
  noticiasPorPagina = 4;
  indiceNoticias = 0;

  get noticiasVisibles(): NoticiaVM[] {
    return this.noticias().slice(
      this.indiceNoticias,
      this.indiceNoticias + this.noticiasPorPagina,
    );
  }

  get hayNoticiasAnteriores(): boolean {
    return this.indiceNoticias > 0;
  }

  get hayNoticiasSiguientes(): boolean {
    return (
      this.indiceNoticias + this.noticiasPorPagina < this.noticias().length
    );
  }

  noticiasSiguiente(): void {
    if (this.hayNoticiasSiguientes) {
      this.indiceNoticias++;
    }
  }

  noticiasAnterior(): void {
    if (this.hayNoticiasAnteriores) {
      this.indiceNoticias--;
    }
  }

  // Laboratorios del Centro I+D+i Loyola — nombres, nomenclatura y descripciones oficiales
  laboratorios = [
    {
      codigo: '1A',
      nombre: 'Mecánica Aplicada',
      area: 'Mecánica de Materiales',
      imagen: 'assets/cidil/laboratorios/1A.jpeg',
      descripcion:
        'Orientado al desarrollo de experimentación o ensayos de fenómenos físicos que fundamentan la electromecánica y la construcción, con prácticas en Mecánica de Fluidos, Resistencia de Materiales, Ciencia de los Materiales y Termodinámica.',
    },
    {
      codigo: '1B',
      nombre: 'Fábrica Inteligente',
      area: 'Manufactura 4.0',
      imagen: 'assets/cidil/laboratorios/1B.jpeg',
      descripcion:
        'Permite explorar la evolución de la manufactura hacia la industria 4.0, con un Centro Mecanizado de Tecnología (CNC), robótica colaborativa fija y móvil, y una celda de manufactura totalmente automatizada.',
    },
    {
      codigo: '1C',
      nombre: 'Redes Eléctricas Inteligentes',
      area: 'Energía',
      imagen: 'assets/cidil/laboratorios/1C.jpeg',
      descripcion:
        'Enfocado en el uso razonable y sostenible de la energía, con simulación de sistemas eléctricos complejos, eficiencia energética y proyectos de energías renovables.',
    },
    {
      codigo: '1D',
      nombre: 'Instrumentación y Control de Procesos',
      area: 'Automatización Industrial',
      imagen: 'assets/cidil/laboratorios/1D.jpeg',
      descripcion:
        'Utilizado en la docencia de instrumentación, automatización y control de procesos industriales, base para el desarrollo de competencias en ingeniería de manufactura y procesos.',
    },
    {
      codigo: '2A',
      nombre: 'Microelectrónica',
      area: 'Electrónica',
      imagen: 'assets/cidil/laboratorios/2A.jpeg',
      descripcion:
        'Permite la enseñanza sistematizada de circuitos electrónicos mediante tecnología modular, con docencia en electrónica digital, electrónica de potencia, comunicaciones analógicas y digitales y procesamiento de señales.',
    },
    {
      codigo: '2B',
      nombre: 'Manufactura Automatizada',
      area: 'Producción Industrial',
      imagen: 'assets/cidil/laboratorios/2B.jpeg',
      descripcion:
        'Utilizado para docencia en Automatización Industrial y diseño de sistemas de producción, basado en una celda de manufactura con diferentes estaciones de proceso y control.',
    },
    {
      codigo: '2C',
      nombre: 'Sistemas de Comunicaciones',
      area: 'Telecomunicaciones',
      imagen: 'assets/cidil/laboratorios/2C.jpeg',
      descripcion:
        'Posee equipos para el tratamiento del transporte de información de forma alámbrica e inalámbrica, utilizado en docencia e investigación en radiocomunicaciones.',
    },
    {
      codigo: '2D',
      nombre: 'Multimedia',
      area: 'Sistemas de Audio y Video',
      imagen: 'assets/cidil/laboratorios/2D.jpeg',
      descripcion:
        'Específico del área de Sistemas de Audio y Video, diseñado para el uso y configuración de equipos mediante los cuales los sistemas de telecomunicaciones intercambian información.',
    },
    {
      codigo: '3A',
      nombre: 'Desarrollo de Software',
      area: 'Lenguajes de Programación',
      imagen: 'assets/cidil/laboratorios/3A.jpeg',
      descripcion:
        'Consiste en el uso de herramientas para crear aplicaciones informáticas, útil para la docencia, investigación y servicios de desarrollo de aplicaciones de software.',
    },
    {
      codigo: '3B',
      nombre: 'Sistemas Informáticos y Diseño',
      area: 'Diseño CAD/CAM',
      imagen: 'assets/cidil/laboratorios/3B.jpeg',
      descripcion:
        'Se basa en métodos y procedimientos del proceso de información, parte del área de Diseño CAD/CAM, centrado en docencia de Dibujo 2D, 3D, diseño de prototipos y productos de ingeniería.',
    },
    {
      codigo: '3C',
      nombre: 'Redes Convergentes',
      area: 'Diseño de Redes de Datos',
      imagen: 'assets/cidil/laboratorios/3C.jpeg',
      descripcion:
        'Perteneciente al área de Redes de Datos, se fundamenta en la integración de los servicios sobre una sola red, basada en IP como protocolo de nivel de red.',
    },
    {
      codigo: '3D',
      nombre: 'Informática Forense',
      area: 'Seguridad de Redes',
      imagen: 'assets/cidil/laboratorios/3D.jpeg',
      descripcion:
        'Integrado al área de Seguridad de Redes, busca aplicar técnicas científicas y analíticas que permitan identificar datos válidos dentro de un proceso legal.',
    },
    {
      codigo: 'TP',
      nombre: 'Taller de Proyectos',
      area: 'Integración de Conocimientos',
      imagen: 'assets/cidil/laboratorios/PROYEC.jpeg',
      descripcion:
        'Diseñado para la elaboración de prototipos de proyectos integradores, presentados normalmente en la Feria Técnica de Creatividad e Innovación.',
    },
    {
      codigo: 'GI1',
      nombre: 'Laboratorios Generales de Informática I',
      area: 'Formación Transversal',
      imagen: 'assets/cidil/laboratorios/INFO1.jpeg',
      descripcion:
        'Requeridos para la enseñanza de múltiples asignaturas transversales a las ingenierías: diseño computarizado, aplicaciones informáticas y métodos numéricos, entre otras.',
    },
    {
      codigo: 'GI2',
      nombre: 'Laboratorios Generales de Informática II',
      area: 'Formación Transversal',
      imagen: 'assets/cidil/laboratorios/INFO2.jpeg',
      descripcion:
        'Requeridos para la enseñanza de múltiples asignaturas transversales a las ingenierías: diseño computarizado, aplicaciones informáticas y métodos numéricos, entre otras.',
    },
  ];

  anuncioDetalle: any = null;
  pasantiaSeleccionada: any = null;

  constructor(private publicacionService: PublicacionService) {}

  ngOnInit(): void {
    this.cargarAnuncios();
    this.iniciarCarrusel();
    this.iniciarObservadorSecciones();

    this.publicacionService.getNoticiasIeeslOTecnologia().subscribe({
      next: (n) => {
        console.log(n);
        this.noticias.set(n);
      },
    });
  }

  // Sección actualmente visible — para resaltar el enlace correspondiente del nav
  seccionActiva = '';

  private iniciarObservadorSecciones(): void {
    // Espera al render inicial y observa las secciones con id
    setTimeout(() => {
      const secciones = document.querySelectorAll('section[id]');
      if (!('IntersectionObserver' in window) || secciones.length === 0) return;

      const observador = new IntersectionObserver(
        (entradas) => {
          for (const entrada of entradas) {
            if (entrada.isIntersecting) {
              this.seccionActiva = entrada.target.id;
            }
          }
        },
        { rootMargin: '-35% 0px -55% 0px' },
      );

      secciones.forEach((s) => observador.observe(s));
    }, 500);
  }

  cargarAnuncios(): void {
    this.publicacionService.getAnuncios().subscribe(
      (data: any[]) => {
        this.anuncios = data;
        this.anunciosCarrusel = data.filter((a: any) => a.esCarrusel);
        if (this.anunciosCarrusel.length > 0) {
          this.anuncioActual = this.anunciosCarrusel[0];
        }
      },
      (error: any) => {
        console.error('Error al cargar anuncios:', error);
      },
    );
  }

  iniciarCarrusel(): void {
    setInterval(() => {
      this.avanzarCarrusel();
    }, 8000);
  }

  avanzarCarrusel(): void {
    if (this.anunciosCarrusel.length > 0) {
      this.indiceCarrusel =
        (this.indiceCarrusel + 1) % this.anunciosCarrusel.length;
      this.anuncioActual = this.anunciosCarrusel[this.indiceCarrusel];
    }
  }

  retrocederCarrusel(): void {
    if (this.anunciosCarrusel.length > 0) {
      this.indiceCarrusel =
        (this.indiceCarrusel - 1 + this.anunciosCarrusel.length) %
        this.anunciosCarrusel.length;
      this.anuncioActual = this.anunciosCarrusel[this.indiceCarrusel];
    }
  }

  irAlIndice(index: number): void {
    this.indiceCarrusel = index;
    this.anuncioActual = this.anunciosCarrusel[index];
  }

  formatearFecha(fecha: any): string {
    if (!fecha) return '';
    try {
      return formatDistanceToNow(new Date(fecha), {
        addSuffix: true,
        locale: es,
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return '';
    }
  }

  abrirDetalle(anuncio: any): void {
    this.anuncioDetalle = anuncio;
  }

  cerrarDetalle(): void {
    this.anuncioDetalle = null;
  }

  abrirPasantia(pasantia: any): void {
    this.pasantiaSeleccionada = pasantia;
  }

  cerrarPasantia(): void {
    this.pasantiaSeleccionada = null;
  }
}

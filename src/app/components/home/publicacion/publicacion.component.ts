import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PublicacionService } from '../../../services/publicacion.service';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-publicacion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './publicacion.component.html',
  styleUrls: ['./publicacion.component.css']
})
export class PublicacionComponent implements OnInit {
  anuncios: any[] = [];
  anunciosCarrusel: any[] = [];
  anuncioActual: any = null;
  indiceCarrusel = 0;

  laboratorioSeleccionado: any = null;

  abrirLab(lab: any): void {
    this.laboratorioSeleccionado = lab;
  }

  cerrarLab(): void {
    this.laboratorioSeleccionado = null;
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
    document.documentElement.style.setProperty('--reading-progress', `${progreso}%`);

    // Botón visible después de bajar más de una pantalla
    this.mostrarVolverArriba = scrollTop > 480;

    // Header con sombra cuando el usuario ha bajado
    this.headerConScroll = scrollTop > 10;
  }

  volverArriba(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Noticias reales del IEESL — imagen y enlace tomados de superior.ipl.edu.do
  noticiasIEESL = [
    {
      id: 1,
      titulo: "Estudiante del IEESL Realiza Intercambio Académico en México",
      descripcion: "Virmary Estel de los Santos Martínez, estudiante de Ingeniería Eléctrica, participa en una experiencia de intercambio académico en la Universidad Iberoamericana León, México, durante el verano 2026 mediante beca AUSJAL.",
      fecha: "26 de junio, 2026",
      categoria: "Académica",
      imagen: "https://superior.ipl.edu.do/media/widgetkit/Virmary_en_IBero_Mxico-439c5c5c316b3e68f3ad1665acfc00ae.jpg",
      url: "https://superior.ipl.edu.do/novedades-noticias/476-estudiante-del-ieesl-realiza-intercambio-academico-en-mexico-mediante-beca-de-ausjal"
    },
    {
      id: 2,
      titulo: "IEESL Participa en Conferencia Internacional sobre Inteligencia Artificial",
      descripcion: "Representantes del IEESL participaron en la cuadragésima edición de la Conferencia AJCU-CITM 2026 en Nueva York, donde más de 30 universidades jesuitas reflexionaron sobre los desafíos de la IA en la educación superior.",
      fecha: "4 de junio, 2026",
      categoria: "Tecnología",
      imagen: "https://superior.ipl.edu.do/media/widgetkit/Ausjal0-f953ab8126b7bda2192f933b9e0e666e.jpeg",
      url: "https://superior.ipl.edu.do/novedades-noticias/474-ieesl-participa-en-conferencia-internacional-sobre-inteligencia-artificial-y-educacion-superior-organizada-por-universidades-jesuitas-de-america"
    },
    {
      id: 3,
      titulo: "Egresada de IEESL Comparte su Experiencia Transformadora",
      descripcion: "Angie Mariel Valdez Jorge afirma que estudiar en la institución fue la mejor decisión de su vida, destacando la disciplina y dedicación de los docentes en su formación profesional.",
      fecha: "8 de junio, 2026",
      categoria: "Historias de Éxito",
      imagen: "https://superior.ipl.edu.do/media/widgetkit/1000393076-a55cff46da8ffac68a008f7473ceb733.png",
      url: "https://superior.ipl.edu.do/novedades-noticias/475-egresada-de-ieesl-asegura-que-estudiar-en-la-institucion-fue-la-mejor-decision-de-su-vida"
    },
    {
      id: 4,
      titulo: "Estudiantes del IEESL Presentan 47 Proyectos Innovadores",
      descripcion: "En la Feria Técnica de Innovación, futuros ingenieros y tecnólogos presentaron 47 proyectos innovadores diseñados para dar soluciones a problemáticas locales y nacionales.",
      fecha: "28 de marzo, 2026",
      categoria: "Innovación",
      imagen: "https://superior.ipl.edu.do/media/widgetkit/20260328_094542-1a01ede794999aa8e2788885acec82d0.jpg",
      url: "https://superior.ipl.edu.do/novedades-noticias/471-estudiantes-del-ieesl-presentan-47-proyectos-innovadores"
    },
    {
      id: 5,
      titulo: "Diez Estudiantes del IEESL Reciben Becas de Jabil",
      descripcion: "Estudiantes de Ingeniería Industrial e Ingeniería Eléctrica fueron seleccionados para recibir becas de la multinacional estadounidense Jabil, consolidando alianzas estratégicas.",
      fecha: "15 de marzo, 2026",
      categoria: "Becas",
      imagen: "https://superior.ipl.edu.do/media/widgetkit/R62_2129-7cac6a3744ec54ebfbd0d65fac443afa.jpg",
      url: "https://superior.ipl.edu.do/novedades-noticias/470-estudiantes-del-ieesl-reciben-becas-tras-convenio-con-jabil"
    },
    {
      id: 6,
      titulo: "IEESL Inaugura Extensión en Dajabón con Presencia Presidencial",
      descripcion: "El Presidente Abinader inauguró oficialmente la Extensión Dajabón del IEESL, inaugurando 9 laboratorios especializados y anunciando 400 becas para la región fronteriza.",
      fecha: "25 de enero, 2026",
      categoria: "Expansión",
      imagen: "https://superior.ipl.edu.do/media/widgetkit/PHOTO-2026-01-27-09-52-43-2a13f38c172eb82ebd184070bece3e5a.jpg",
      url: "https://superior.ipl.edu.do/novedades-noticias/464-ieesl-inaugura-extension-en-dajabon-con-presencia-del-presidente-abinader-y-anuncia-400-becas"
    },
    {
      id: 7,
      titulo: "IEESL Inicia Cuatrimestre con Conferencia sobre Ética e IA",
      descripcion: "El inicio del cuatrimestre enero-abril contó con una conferencia especializada sobre los aspectos éticos de la Inteligencia Artificial en la educación superior.",
      fecha: "9 de enero, 2026",
      categoria: "Académica",
      imagen: "https://superior.ipl.edu.do/media/widgetkit/IA-f0c22a42c33ba8ac07aa166eb44482dd.jpg",
      url: "https://superior.ipl.edu.do/novedades-noticias/463-ieesl-inicia-el-cuatrimestre-enero-abril-con-conferencia-sobre-etica-e-inteligencia-artificial"
    },
    {
      id: 8,
      titulo: "IEESL Gradúa Cerca de 200 Nuevos Profesionales",
      descripcion: "Con su 17ª ceremonia de graduación, el IEESL alcanzó un hito histórico al superar los 4,000 egresados desde su fundación, demostrando su impacto formativo.",
      fecha: "18 de octubre, 2025",
      categoria: "Graduación",
      imagen: "https://superior.ipl.edu.do/media/widgetkit/web-ec590ff5f452cd5e1ab234bb8317b438.jpg",
      url: "https://superior.ipl.edu.do/novedades-noticias/456-ieesl-gradua-cerca-de-doscientos-nuevos-profesionales"
    },
    {
      id: 9,
      titulo: "IEESL Inaugura Diplomado para 500 Docentes",
      descripcion: "Programa de 4 meses para actualización en Planificación Curricular y Metodologías Activas, beneficiando a cientos de educadores de la región.",
      fecha: "15 de noviembre, 2025",
      categoria: "Formación Docente",
      imagen: "https://superior.ipl.edu.do/media/widgetkit/DPC-66e2b6b34e65c09a302870cb15380bd3.jpg",
      url: "https://superior.ipl.edu.do/novedades-noticias/430-ieesl-inaugura-diplomado-para-500-docentes"
    },
    {
      id: 10,
      titulo: "COIL 2024: Congreso de Ingeniería Loyola",
      descripcion: "9no Congreso promoviendo la innovación para el desarrollo y la investigación científica, reuniendo a especialistas de distintas áreas de ingeniería.",
      fecha: "8 de noviembre, 2024",
      categoria: "Investigación",
      imagen: "https://superior.ipl.edu.do/media/widgetkit/DSC_7463-0faa89c3ce64023b38e4b4d2f4d46964.jpg",
      url: "https://superior.ipl.edu.do/novedades-noticias/431-coil-2024-promueve-la-innovacion-para-el-desarrollo"
    },
    {
      id: 11,
      titulo: "Diplomado de Emprendimiento 2024 Culmina",
      descripcion: "153 graduados reciben certificación en desarrollo de competencias empresariales, fortaleciendo el ecosistema emprendedor de la región.",
      fecha: "12 de octubre, 2024",
      categoria: "Emprendimiento",
      imagen: "https://superior.ipl.edu.do/media/widgetkit/_DSC0585-6e748c2530cf3c061e495a239f3fe749.jpg",
      url: "https://superior.ipl.edu.do/novedades-noticias/427-ieesl-y-banco-popular-dominicano-culminan-diplomado-de-emprendimiento-2024"
    },
    {
      id: 12,
      titulo: "Ciclo de Conferencias Ecológicas",
      descripcion: "Más de 900 personas participaron en reflexión sobre medioambiente y acción ciudadana, promoviendo la sostenibilidad en la comunidad académica.",
      fecha: "20 de septiembre, 2024",
      categoria: "Sostenibilidad",
      imagen: "https://superior.ipl.edu.do/media/widgetkit/DSC_7239-9f49e44569afc8a43b971570e56ccc6d.jpg",
      url: "https://superior.ipl.edu.do/novedades-noticias/458-loyola-desarrolla-ciclo-de-conferencias-ecologicas-medioambiente-en-equilibrio"
    }
  ];

  // Carrusel deslizable de noticias — muestra 4 tarjetas a la vez, se desplaza de una en una
  noticiasPorPagina = 4;
  indiceNoticias = 0;

  get noticiasVisibles(): any[] {
    return this.noticiasIEESL.slice(this.indiceNoticias, this.indiceNoticias + this.noticiasPorPagina);
  }

  get hayNoticiasAnteriores(): boolean {
    return this.indiceNoticias > 0;
  }

  get hayNoticiasSiguientes(): boolean {
    return this.indiceNoticias + this.noticiasPorPagina < this.noticiasIEESL.length;
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
      codigo: "1A",
      nombre: "Mecánica Aplicada",
      area: "Mecánica de Materiales",
      imagen: "assets/cidil/laboratorios/mecanica-aplicada.jpg",
      descripcion: "Orientado al desarrollo de experimentación o ensayos de fenómenos físicos que fundamentan la electromecánica y la construcción, con prácticas en Mecánica de Fluidos, Resistencia de Materiales, Ciencia de los Materiales y Termodinámica."
    },
    {
      codigo: "1B",
      nombre: "Fábrica Inteligente",
      area: "Manufactura 4.0",
      imagen: "assets/cidil/laboratorios/fabrica-inteligente.jpg",
      descripcion: "Permite explorar la evolución de la manufactura hacia la industria 4.0, con un Centro Mecanizado de Tecnología (CNC), robótica colaborativa fija y móvil, y una celda de manufactura totalmente automatizada."
    },
    {
      codigo: "1C",
      nombre: "Redes Eléctricas Inteligentes",
      area: "Energía",
      imagen: "assets/cidil/laboratorios/redes-electricas.jpg",
      descripcion: "Enfocado en el uso razonable y sostenible de la energía, con simulación de sistemas eléctricos complejos, eficiencia energética y proyectos de energías renovables."
    },
    {
      codigo: "1D",
      nombre: "Instrumentación y Control de Procesos",
      area: "Automatización Industrial",
      imagen: "assets/cidil/laboratorios/instrumentacion-control.jpg",
      descripcion: "Utilizado en la docencia de instrumentación, automatización y control de procesos industriales, base para el desarrollo de competencias en ingeniería de manufactura y procesos."
    },
    {
      codigo: "2A",
      nombre: "Microelectrónica",
      area: "Electrónica",
      imagen: "assets/cidil/laboratorios/microelectronica.jpg",
      descripcion: "Permite la enseñanza sistematizada de circuitos electrónicos mediante tecnología modular, con docencia en electrónica digital, electrónica de potencia, comunicaciones analógicas y digitales y procesamiento de señales."
    },
    {
      codigo: "2B",
      nombre: "Manufactura Automatizada",
      area: "Producción Industrial",
      imagen: "assets/cidil/laboratorios/manufactura-automatizada.jpg",
      descripcion: "Utilizado para docencia en Automatización Industrial y diseño de sistemas de producción, basado en una celda de manufactura con diferentes estaciones de proceso y control."
    },
    {
      codigo: "2C",
      nombre: "Sistemas de Comunicaciones",
      area: "Telecomunicaciones",
      imagen: "assets/cidil/laboratorios/sistemas-comunicaciones.jpg",
      descripcion: "Posee equipos para el tratamiento del transporte de información de forma alámbrica e inalámbrica, utilizado en docencia e investigación en radiocomunicaciones."
    },
    {
      codigo: "2D",
      nombre: "Multimedia",
      area: "Sistemas de Audio y Video",
      imagen: "assets/cidil/laboratorios/multimedia.jpg",
      descripcion: "Específico del área de Sistemas de Audio y Video, diseñado para el uso y configuración de equipos mediante los cuales los sistemas de telecomunicaciones intercambian información."
    },
    {
      codigo: "3A",
      nombre: "Desarrollo de Software",
      area: "Lenguajes de Programación",
      imagen: "assets/cidil/laboratorios/desarrollo-software.jpg",
      descripcion: "Consiste en el uso de herramientas para crear aplicaciones informáticas, útil para la docencia, investigación y servicios de desarrollo de aplicaciones de software."
    },
    {
      codigo: "3B",
      nombre: "Sistemas Informáticos y Diseño",
      area: "Diseño CAD/CAM",
      imagen: "assets/cidil/laboratorios/sistemas-diseno.jpg",
      descripcion: "Se basa en métodos y procedimientos del proceso de información, parte del área de Diseño CAD/CAM, centrado en docencia de Dibujo 2D, 3D, diseño de prototipos y productos de ingeniería."
    },
    {
      codigo: "3C",
      nombre: "Redes Convergentes",
      area: "Diseño de Redes de Datos",
      imagen: "assets/cidil/laboratorios/redes-convergentes.jpg",
      descripcion: "Perteneciente al área de Redes de Datos, se fundamenta en la integración de los servicios sobre una sola red, basada en IP como protocolo de nivel de red."
    },
    {
      codigo: "3D",
      nombre: "Informática Forense",
      area: "Seguridad de Redes",
      imagen: "assets/cidil/laboratorios/informatica-forense.jpg",
      descripcion: "Integrado al área de Seguridad de Redes, busca aplicar técnicas científicas y analíticas que permitan identificar datos válidos dentro de un proceso legal."
    },
    {
      codigo: "TP",
      nombre: "Taller de Proyectos",
      area: "Integración de Conocimientos",
      imagen: "assets/cidil/laboratorios/taller-proyectos.jpg",
      descripcion: "Diseñado para la elaboración de prototipos de proyectos integradores, presentados normalmente en la Feria Técnica de Creatividad e Innovación."
    },
    {
      codigo: "GI",
      nombre: "Laboratorios Generales de Informática I y II",
      area: "Formación Transversal",
      imagen: "assets/cidil/laboratorios/informatica-general.jpg",
      descripcion: "Requeridos para la enseñanza de múltiples asignaturas transversales a las ingenierías: diseño computarizado, aplicaciones informáticas y métodos numéricos, entre otras."
    }
  ];

  anuncioDetalle: any = null;
  pasantiaSeleccionada: any = null;

  constructor(private publicacionService: PublicacionService) {}

  ngOnInit(): void {
    this.cargarAnuncios();
    this.iniciarCarrusel();
    this.iniciarObservadorSecciones();
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
        { rootMargin: '-35% 0px -55% 0px' }
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
      }
    );
  }

  iniciarCarrusel(): void {
    setInterval(() => {
      this.avanzarCarrusel();
    }, 8000);
  }

  avanzarCarrusel(): void {
    if (this.anunciosCarrusel.length > 0) {
      this.indiceCarrusel = (this.indiceCarrusel + 1) % this.anunciosCarrusel.length;
      this.anuncioActual = this.anunciosCarrusel[this.indiceCarrusel];
    }
  }

  retrocederCarrusel(): void {
    if (this.anunciosCarrusel.length > 0) {
      this.indiceCarrusel = (this.indiceCarrusel - 1 + this.anunciosCarrusel.length) % this.anunciosCarrusel.length;
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
      return formatDistanceToNow(new Date(fecha), { addSuffix: true, locale: es });
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

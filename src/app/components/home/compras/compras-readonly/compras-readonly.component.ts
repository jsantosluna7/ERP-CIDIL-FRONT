import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faAngleDown,
  faAngleRight,
  faArrowRight,
  faBox,
  faBoxesPacking,
  faBoxOpen,
  faBuilding,
  faCalendar,
  faCartShopping,
  faCircleCheck,
  faCircleXmark,
  faClipboard,
  faClipboardCheck,
  faFile,
  faMagnifyingGlass,
  faMessage,
  faTruck,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { ComprasService } from '../../../../services/Api/compras.service';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  map,
  switchMap,
} from 'rxjs';
import {
  InformacionTimelineComponent,
  OrdenesInfo,
} from './informacion-timeline/informacion-timeline.component';
import { CantidadOrdenesCacheService } from '../../../../core/CantidadOrdenesCache/cantidad-ordenes-cache.service';
import {
  ItemOrden,
  OrdenSolicitud,
} from '../compras-admin/compras-admin.component';
import { EstadosTimelineCacheService } from '../../../../core/EstadosTimelineCache/estados-timeline-cache.service';
import { ItemsOrdenCacheService } from '../../../../core/ItemsOrdenCache/items-orden-cache.service';
import { Ordenes } from '../compras-admin/actualizar-estatus-compra/actualizar-estatus-compra.component';
import { OrdenesItems } from '../compras-admin/actualizar-estatus/actualizar-estatus.component';

@Component({
  selector: 'app-compras-readonly',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIcon,
    FontAwesomeModule,
    MatFormFieldModule,
    MatChipsModule,
    MatInputModule,
    MatExpansionModule,
    MatButtonModule,
  ],
  templateUrl: './compras-readonly.component.html',
  styleUrl: './compras-readonly.component.css',
})
export class ComprasReadonlyComponent {
  // DATA
  ordenes: OrdenSolicitud[] = [];
  items: ItemOrden[] = [];

  // VARIABLES
  cantidadOrdenes: number = 0;
  filtroSeleccionado = new FormControl('codigo');
  termino = new FormControl('');
  expandedOrderId: number | null = null;

  // ITEMS DE FILTRADO
  filtros = [
    { label: 'Código', value: 'codigo' },
    { label: 'Nombre', value: 'nombre' },
  ];

  // MAPA DE ICONOS
  iconMap: Record<string, any> = {
    file: faFile,
    lupa: faMagnifyingGlass,
    clipCheck: faClipboardCheck,
    cartShopping: faCartShopping,
    camion: faTruck,
    boxOpen: faBoxOpen,
    boxPacking: faBoxesPacking,
    circleCheck: faCircleCheck,
    circleXmark: faCircleXmark,
    calendar: faCalendar,
    upload: faUpload,
    box: faBox,
    dep: faBuilding,
    mensaje: faMessage,
    angelRight: faAngleRight,
    angelDown: faAngleDown,
    clip: faClipboard,
  };

  // ICONOS PILLS
  file = faFile;
  lupa = faMagnifyingGlass;
  clipCheck = faClipboardCheck;
  cartShopping = faCartShopping;
  camion = faTruck;
  boxOpen = faBoxOpen;
  boxPacking = faBoxesPacking;
  circleCheck = faCircleCheck;
  circleXmark = faCircleXmark;

  // ICONOS REGULARES
  calendar = faCalendar;
  upload = faUpload;
  box = faBox;
  dep = faBuilding;
  mensaje = faMessage;
  angelRight = faAngleRight;
  angelDown = faAngleDown;
  clip = faClipboard;
  arrowRight = faArrowRight;

  // VARIABLES URL
  urlCantidadOrdenes: string = `${process.env['API_URL']}${process.env['ENDPOINT_CANTIDAD_ORDENES']}`;
  urlOrdenes: string = `${process.env['API_URL']}${process.env['ENDPOINT_ORDENES']}`;
  urlEstadosTimeline: string = `${process.env['API_URL']}${process.env['ENDPOINT_ESTADOS_TIMELINE_ID']}`;
  urlBusqueda: string = `${process.env['API_URL']}${process.env['ENDPOINT_BUSCAR_ORDENES']}`;

  // VARIABLES LOADING
  loadingOrdenes = false; // cargar lista principal
  loadingUpload = false; // subir PDF
  updatingOrdenId: number | null = null;
  updatingItemId: number | null = null;

  constructor(
    private dialog: MatDialog,
    private _compras: ComprasService,
    private _toastr: ToastrService,
    private _cantidadOrdenes: CantidadOrdenesCacheService,
    private _estadosTimeline: EstadosTimelineCacheService,
    private _itemsOrden: ItemsOrdenCacheService,
  ) {}

  ngOnInit(): void {
    //Busqueda en vivo con el backend
    this.termino.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((valor: any) => {
        if (valor && valor.trim() !== '') {
          this.busquedaEnBackend(valor.trim());
        } else {
          this.cargarCompras();
        }
      });

    this.cargarCantidadCompras();
    this.cargarCompras();
  }

  cargarCompras(): void {
    this.loadingOrdenes = true;

    this._compras
      .obtenerOrdenes(this.urlOrdenes)
      .pipe(
        switchMap((ordenes: OrdenSolicitud[]) =>
          forkJoin(
            ordenes.map((orden) =>
              forkJoin({
                timeline: this._estadosTimeline.obtenerPorId(
                  this.urlEstadosTimeline,
                  orden.estadoTimelineId,
                ),
              }).pipe(
                map(({ timeline }) => ({
                  ...orden,
                  timeline,
                })),
              ),
            ),
          ),
        ),
      )
      .subscribe({
        next: (resultado) => {
          this.ordenes = resultado;
          this.loadingOrdenes = false;
        },
        error: (err) => {
          this.loadingOrdenes = false;
          this._toastr.error('No se pudieron cargar las órdenes.', 'Error');
        },
      });
  }

  cargarCantidadCompras(): void {
    this._cantidadOrdenes.obtenerCantidad(this.urlCantidadOrdenes).subscribe({
      next: (cantidad) => {
        this.cantidadOrdenes = cantidad;
      },
      error: (err) => {
        console.error('Error al obtener la cantidad de órdenes:', err);
      },
    });
  }

  obtenerOrdenes(id: number) {
    const dialogRef = this.dialog.open(InformacionTimelineComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('El dialogo se cerró');
    });
  }

  cambiarFiltro(filtro: string): void {
    this.filtroSeleccionado.setValue(filtro);
    if (this.termino.value?.trim()) {
      // Refrescar búsqueda con el nuevo filtro activo
      this.busquedaEnBackend(this.termino.value.trim());
    }
  }

  busquedaEnBackend(nombre: string): void {
    this.loadingOrdenes = true;
    this._compras
      .buscarOrdenes(
        this.urlBusqueda,
        nombre,
        this.filtroSeleccionado.value ?? 'codigo',
      )
      .pipe(
        switchMap((ordenes: OrdenSolicitud[]) =>
          forkJoin(
            ordenes.map((orden) =>
              forkJoin({
                timeline: this._estadosTimeline.obtenerPorId(
                  this.urlEstadosTimeline,
                  orden.estadoTimelineId,
                ),
              }).pipe(
                map(({ timeline }) => ({
                  ...orden,
                  timeline,
                })),
              ),
            ),
          ),
        ),
      )
      .subscribe({
        next: (resultado) => {
          this.ordenes = resultado;
          this.loadingOrdenes = false;
        },
        error: (err) => {
          this.loadingOrdenes = false;
          this._toastr.error('No se pudieron cargar las órdenes.', 'Error');
        },
      });
  }

  calcularPorcentaje(orden: OrdenSolicitud): number {
    if (!orden || orden.itemsCount === 0) {
      return 0;
    }

    return Math.round((orden.itemsRecibidos / orden.itemsCount) * 100);
  }
}

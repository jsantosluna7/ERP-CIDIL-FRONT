import { Component } from '@angular/core';
import { ComprasFileDialogComponent } from '../compras-file-dialog/compras-file-dialog.component';
import {
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  map,
  of,
  switchMap,
  take,
} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ComprasService } from '../../../../services/Api/compras.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  faAngleDown,
  faAngleRight,
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
import { ActualizarEstatusComponent } from './actualizar-estatus/actualizar-estatus.component';
import {
  ActualizarEstatusCompraComponent,
  Ordenes,
} from './actualizar-estatus-compra/actualizar-estatus-compra.component';
import { ToastrService } from 'ngx-toastr';
import { CantidadOrdenesCacheService } from '../../../../core/CantidadOrdenesCache/cantidad-ordenes-cache.service';
import { EstadosTimelineCacheService } from '../../../../core/EstadosTimelineCache/estados-timeline-cache.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ItemsOrdenCacheService } from '../../../../core/ItemsOrdenCache/items-orden-cache.service';
import { ItemOrden, OrdenSolicitud } from '../../../../interfaces/compras';

@Component({
  selector: 'app-compras-admin',
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
    MatProgressSpinnerModule,
  ],
  templateUrl: './compras-admin.component.html',
  styleUrl: './compras-admin.component.css',
})
export class ComprasAdminComponent {
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

  openDialog(): void {
    const dialogRef = this.dialog.open(ComprasFileDialogComponent);

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        console.log(result);
        if (result?.success === true) {
          this.loadingUpload = true;

          forkJoin([
            this._cantidadOrdenes.obtenerCantidad(this.urlCantidadOrdenes),
            this._compras.obtenerOrdenes(this.urlOrdenes),
          ]).subscribe(() => {
            this.loadingUpload = false;
            this.cargarCantidadCompras();
            this.cargarCompras();
          });
        }
      });
  }

  toggle(id: number, orden: OrdenSolicitud) {
    this.expandedOrderId = this.expandedOrderId === id ? null : id;

    if (orden.itemsLoaded) return;

    orden.loadingItems = true;

    this._itemsOrden
      .obtenerPorId(orden.id)
      .pipe(
        switchMap((items: ItemOrden[]) =>
          forkJoin(
            items.map((item) =>
              this._estadosTimeline
                .obtenerPorId(this.urlEstadosTimeline, item.estadoTimelineId)
                .pipe(
                  map((estadosTimeline) => ({
                    ...item,
                    estadosTimeline,
                    fechaActualizacion: new Date(
                      item.actualizadoEn,
                    ).toLocaleDateString('es-DO', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    }),
                  })),
                ),
            ),
          ),
        ),
      )
      .subscribe({
        next: (resultado) => {
          orden.items = resultado;
          orden.itemsLoaded = true;
          orden.loadingItems = false;
        },
        error: (err) => {
          orden.loadingItems = false;
          this._toastr.error('No se pudieron cargar las órdenes.', 'Error');
          console.error('Error al obtener las órdenes:', err);
        },
      });
  }

  actualizarItem(id: number, ordenId: number, item: ItemOrden) {
    this.updatingItemId = id;
    const dialogRef = this.dialog.open(ActualizarEstatusComponent, {
      data: { id, ordenId, item },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.updatingItemId = null;
      if (result?.ordenId) {
        this._itemsOrden.limpiarCache(result.ordenId);
        this.recargarOrden(result.ordenId);
      }
    });
  }

  editarOrden(event: MouseEvent, id: number, orden: OrdenSolicitud) {
    event.stopPropagation();
    this.updatingOrdenId = id;

    const dialogRef = this.dialog.open(ActualizarEstatusCompraComponent, {
      data: { id, orden },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.updatingOrdenId = null;
      this.expandedOrderId = null;
      if (result) {
        this.cargarCompras();
      }
    });
  }

  private recargarOrden(ordenId: number) {
    this._compras
      .obtenerOrdenes(this.urlOrdenes)
      .pipe(
        map((ordenes) => ordenes.find((o) => o.id === ordenId)),
        switchMap((orden) =>
          forkJoin({
            timeline: this._estadosTimeline.obtenerPorId(
              this.urlEstadosTimeline,
              orden!.estadoTimelineId,
            ),
            items: this._itemsOrden.obtenerPorId(orden!.id).pipe(
              switchMap((items) =>
                items.length
                  ? forkJoin(
                      items.map((item) =>
                        this._estadosTimeline
                          .obtenerPorId(
                            this.urlEstadosTimeline,
                            item.estadoTimelineId,
                          )
                          .pipe(
                            map((estadosTimeline) => ({
                              ...item,
                              estadosTimeline,
                              fechaActualizacion: new Date(
                                item.actualizadoEn,
                              ).toLocaleDateString('es-DO', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              }),
                            })),
                          ),
                      ),
                    )
                  : of([]),
              ),
            ),
          }),
        ),
      )
      .subscribe(({ timeline, items }) => {
        const index = this.ordenes.findIndex((o) => o.id === ordenId);
        if (index !== -1) {
          this.ordenes[index] = {
            ...this.ordenes[index],
            timeline,
            items,
            itemsLoaded: true,
            loadingItems: false,
          };
        }
      });
  }
}

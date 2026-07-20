import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  ItemOrden,
  OrdenSolicitud,
  TimelineOrden,
} from '../../../../../interfaces/compras';
import { TimelineOrdenCacheService } from '../../../../../core/TimelineOrdenCache/timeline-orden-cache.service';
import { EstadosTimelineCacheService } from '../../../../../core/EstadosTimelineCache/estados-timeline-cache.service';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { ItemsOrdenCacheService } from '../../../../../core/ItemsOrdenCache/items-orden-cache.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-informacion-timeline',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    FaIconComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './informacion-timeline.component.html',
  styleUrl: './informacion-timeline.component.css',
})
export class InformacionTimelineComponent {
  file = faFile;
  lupa = faMagnifyingGlass;
  clipCheck = faClipboardCheck;
  cartShopping = faCartShopping;
  camion = faTruck;
  boxOpen = faBoxOpen;
  boxPacking = faBoxesPacking;
  circleCheck = faCircleCheck;
  circleXmark = faCircleXmark;

  calendar = faCalendar;
  upload = faUpload;
  box = faBox;
  dep = faBuilding;
  mensaje = faMessage;
  angelRight = faAngleRight;
  angelDown = faAngleDown;
  clip = faClipboard;

  arrowRight = faArrowRight;

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

  readonly dialogRef = inject(MatDialogRef<InformacionTimelineComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly orden = model<OrdenSolicitud>(this.data.orden);

  urlEstadosTimeline: string = `${process.env['API_URL']}${process.env['ENDPOINT_ESTADOS_TIMELINE_ID']}`;

  timelineOrden: TimelineOrden[] = [];
  items: ItemOrden[] = [];

  loadingDatos = false;

  constructor(
    private _timelineOrden: TimelineOrdenCacheService,
    private _estadosTimeline: EstadosTimelineCacheService,
    private _itemsOrden: ItemsOrdenCacheService,
    private _toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.obtenerDatos();
  }

  obtenerDatos(): void {
    this.loadingDatos = true;

    forkJoin({
      timelineOrden: this._timelineOrden.obtenerPorId(this.orden().id).pipe(
        switchMap((timelineOrden: TimelineOrden[]) =>
          timelineOrden.length
            ? forkJoin(
                timelineOrden.map((timeline) =>
                  this._estadosTimeline
                    .obtenerPorId(
                      this.urlEstadosTimeline,
                      timeline.estadoTimelineId,
                    )
                    .pipe(
                      map((estadosTimeline) => ({
                        ...timeline,
                        estadosTimeline,
                        fechaActualizacion: new Date(
                          timeline.fechaEvento,
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

      items: this._itemsOrden.obtenerPorId(this.orden().id).pipe(
        switchMap((items: ItemOrden[]) =>
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
    }).subscribe({
      next: ({ timelineOrden, items }) => {
        this.timelineOrden = timelineOrden;
        this.items = items;
        this.loadingDatos = false;
      },
      error: () => {
        this.loadingDatos = false;
        this._toastr.error('No se pudieron cargar los datos.', 'Error');
      },
    });
  }

  onNoCancelar(): void {
    this.dialogRef.close();
  }
}

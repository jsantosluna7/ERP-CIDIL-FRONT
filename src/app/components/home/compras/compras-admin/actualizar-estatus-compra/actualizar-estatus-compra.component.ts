import { Component, inject, model } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ComprasService } from '../../../../../services/Api/compras.service';
import { Timeline } from '../compras-admin.component';
import { map, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UsuariosService } from '../../../../../services/Api/Usuarios/usuarios.service';
import { CantidadOrdenesCacheService } from '../../../../../core/CantidadOrdenesCache/cantidad-ordenes-cache.service';
import { EstadosTimelineCacheService } from '../../../../../core/EstadosTimelineCache/estados-timeline-cache.service';

export interface Ordenes {
  id: number;
}

@Component({
  selector: 'app-actualizar-estatus-compra',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './actualizar-estatus-compra.component.html',
  styleUrl: './actualizar-estatus-compra.component.css',
})
export class ActualizarEstatusCompraComponent {
  urlEstadosTimeline: string = `${process.env['API_URL']}${process.env['ENDPOINT_ESTADOS_TIMELINE']}`;

  estadoId = new FormControl<any | ''>('', Validators.required);
  evento = new FormControl<any | ''>('');

  usuarioLogueado: any;
  readonly dialogRef = inject(MatDialogRef<ActualizarEstatusCompraComponent>);
  readonly data = inject<Ordenes>(MAT_DIALOG_DATA);
  readonly id = model(this.data.id);
  timelines: Timeline[] = [];

  constructor(
    private _compras: ComprasService,
    private _toastr: ToastrService,
    private _usuarios: UsuariosService,
    private _estadosTimeline: EstadosTimelineCacheService
  ) {}

  ngOnInit(): void {
    this._usuarios.user$.subscribe((user) => {
      this.usuarioLogueado = user;
    });

    this.obtenerEstadoTimeline();
  }

  obtenerEstadoTimeline() {
    this._estadosTimeline.obtenerTodos(this.urlEstadosTimeline).subscribe({
      next: (data: Timeline[]) => {
        this.timelines = data;
      },
      error: (err) => {},
    });
  }

  onNoCancelar(): void {
    this.dialogRef.close();
  }

  onSiActualizar(): void {
    if (!this.estadoId.valid) {
      this._toastr.error('Debes agregar el cambio en estado.', 'error');
      return;
    }

    const cambios = {
      estadoTimelineId: this.estadoId.value,
      evento: this.evento.value,
      usuarioId: Number(this.usuarioLogueado.sub),
    };

    this._compras.actualizarEstadoOrden(this.id(), cambios).subscribe({
      next: (act) => {
        this._toastr.success('La orden se actualizó con éxito', 'Éxito');
      },
      error: (err) => {
        this._toastr.error(err);
      },
    });

    this.dialogRef.close(cambios);
  }
}

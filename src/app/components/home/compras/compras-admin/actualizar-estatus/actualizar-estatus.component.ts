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
import { ComprasService } from '../../../../../services/Api/compras.service';
import { ToastrService } from 'ngx-toastr';
import { UsuariosService } from '../../../../../services/Api/Usuarios/usuarios.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ItemOrden } from '../../../../../interfaces/compras';

export interface OrdenesItems {
  id: number;
  ordenId: number;
  item: ItemOrden
}

@Component({
  selector: 'app-actualizar-estatus',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './actualizar-estatus.component.html',
  styleUrl: './actualizar-estatus.component.css',
})
export class ActualizarEstatusComponent {
  cantidadRecibida = new FormControl<number | null>(null, [
    Validators.required,
    Validators.pattern('^[0-9]+$'),
  ]);
  comentario = new FormControl<any | ''>('');
  usuarioLogueado: any;
  loading = false;

  readonly dialogRef = inject(MatDialogRef<ActualizarEstatusComponent>);
  readonly data = inject<OrdenesItems>(MAT_DIALOG_DATA);
  readonly id = model(this.data.id);
  readonly ordenId = model(this.data.ordenId);
  readonly item = model(this.data.item);

  constructor(
    private _compras: ComprasService,
    private _toastr: ToastrService,
    private _usuarios: UsuariosService
  ) {}

  ngOnInit(): void {
    this._usuarios.user$.subscribe((user) => {
      this.usuarioLogueado = user;
    });
  }

  onNoCancelar(): void {
    this.dialogRef.close();
  }

  onSiActualizar(): void {
    this.loading = true;
    var comentario;

    if (!this.cantidadRecibida.valid) {
      this._toastr.error(
        'Debes agregar la cantidad recibida del producto.',
        'Error'
      );
      return;
    }

    if (this.comentario.value == '') {
      comentario = null;
    } else {
      comentario = this.comentario.value;
    }

    const cambios = {
      cantidadRecibida: this.cantidadRecibida.value,
      comentario: comentario,
      usuarioId: Number(this.usuarioLogueado.sub),
    };

    const cambiosRespuesta = {
      cantidadRecibida: this.cantidadRecibida.value,
      comentario: comentario,
      usuarioId: Number(this.usuarioLogueado.sub),
      ordenId: this.ordenId()
    };
    

    this._compras.actualizarEstadoItem(this.id(), cambios).subscribe({
      next: (act) => {
        this.loading = false;
        this._toastr.success('El item se actualizó con éxito', 'Éxito');
      },
      error: (err) => {
        this.loading = false;
        this._toastr.error(err.error);
      },
    });

    this.dialogRef.close(cambiosRespuesta);
  }
}

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

export interface OrdenesItems {
  id: number;
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

  readonly dialogRef = inject(MatDialogRef<ActualizarEstatusComponent>);
  readonly data = inject<OrdenesItems>(MAT_DIALOG_DATA);
  readonly id = model(this.data.id);

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

    this._compras.actualizarEstadoItem(this.id(), cambios).subscribe({
      next: (act) => {
        this._toastr.success('El item se actualizó con éxito', 'Éxito');
      },
      error: (err) => {
        console.log(err);
        this._toastr.error(err.error);
      },
    });

    this.dialogRef.close(cambios);
  }
}

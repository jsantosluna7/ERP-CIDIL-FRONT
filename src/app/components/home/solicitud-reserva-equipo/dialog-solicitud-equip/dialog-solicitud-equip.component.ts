import { Component, Inject, model } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { DatosService } from '../../../../services/Datos/datos.service';

@Component({
  selector: 'app-dialog-solicitud-equip',
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule
],
  templateUrl: './dialog-solicitud-equip.component.html',
  styleUrl: './dialog-solicitud-equip.component.css',
})
export class DialogSolicitudEquipComponent {
  comentarioForm: FormGroup;
  readonly selection = model(true);

  constructor(
    public dialogRef: MatDialogRef<DialogSolicitudEquipComponent>,
    @Inject(MAT_DIALOG_DATA)
    private _toastr: ToastrService,
    private _datos: DatosService
  ) {
    this.comentarioForm = new FormGroup({
      comentario: new FormControl('', [Validators.required]),
    });
  }

  comentario() {
    const form = this.comentarioForm;
    if(!form.valid){
      this._toastr.error('Debe ingresar un comentario', 'Error');
      return;
    }else{
      const comentario = {
        comentario: form.value.comentario,
      };
      this._datos.obtenerComentario(comentario);
    }
  }

  onNo() {
    this.dialogRef.close();
  }
}

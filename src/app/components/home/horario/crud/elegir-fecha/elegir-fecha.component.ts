import { CommonModule } from '@angular/common';
import { Component, Inject, model } from '@angular/core';
import {
  FormControl,
  FormGroup,
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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { DatosService } from '../../../../../services/Datos/datos.service';

@Component({
  selector: 'app-elegir-fecha',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './elegir-fecha.component.html',
  styleUrl: './elegir-fecha.component.css',
})
export class ElegirFechaComponent {
  horaForm: FormGroup;
  readonly selection = model(true);

  constructor(
    public dialogRef: MatDialogRef<ElegirFechaComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      titulo: string;
    },
    private _toastr: ToastrService,
    private _datos: DatosService
  ) {
    this.horaForm = new FormGroup({
      fechaInicio: new FormControl('', [Validators.required]),
      fechaFinal: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  fechas() {
    const form = this.horaForm;
    if (!form.valid) {
      this._toastr.error('Debe introducir las fechas');
    } else {
      const fechas = {
        fechaInicio: form.value.fechaInicio,
        fechaFinal: form.value.fechaFinal,
      };
      this._datos.obtenerFecha(fechas);
    }
  }

  onNo() {
    this.dialogRef.close();
  }
}

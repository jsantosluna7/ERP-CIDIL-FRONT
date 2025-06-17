import { Component, Inject, model } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatosService } from '../../../services/Datos/datos.service';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-fecha-dialog',
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './fecha-dialog.component.html',
  styleUrl: './fecha-dialog.component.css',
})
export class FechaDialogComponent {
  readonly fechaForm = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  readonly selection = model(true);

  constructor(
    public dialogRef: MatDialogRef<FechaDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      titulo: string;
    },
    private _toastr: ToastrService,
    private _datos: DatosService
  ) {}

  ngOnInit(): void {}

  fechas() {
    const form = this.fechaForm;
    if (!form.valid) {
      this._toastr.error('Debe introducir las fechas');
    } else {
      const fechas = {
        fechaInicio: form.value.start?.toISOString(),
        fechaFinal: form.value.end?.toISOString(),
      };
    console.log(fechas)
      // this._datos.obtenerFecha(fechas);
    }
  }

  onNo() {
    this.dialogRef.close();
  }
}

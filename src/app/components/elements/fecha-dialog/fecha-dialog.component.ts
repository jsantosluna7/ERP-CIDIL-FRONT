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
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LaboratorioService } from '../../../services/Api/Laboratorio/laboratorio.service';

@Component({
  selector: 'app-fecha-dialog',
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './fecha-dialog.component.html',
  styleUrl: './fecha-dialog.component.css',
})
export class FechaDialogComponent {
  labIdControl = new FormControl<any | ''>('', Validators.required);
  readonly fechaForm = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  labs: any[] = [];
  readonly selection = model(true);

  endpoint: string = `${process.env['API_URL']}${process.env['ENDPOINT_LABORATORIO']}`;

  constructor(
    public dialogRef: MatDialogRef<FechaDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      titulo: string;
      ifLab: boolean;
    },
    private _toastr: ToastrService,
    private _datos: DatosService,
    private _lab: LaboratorioService
  ) {}

  ngOnInit(): void {
    this._lab.getLabs(this.endpoint).subscribe({
      next: (lab) => {
        this.labs = lab;
      },
    });
  }

  fechas() {
    const form = this.fechaForm;
    if (!form.valid) {
      this._toastr.error('Debe introducir las fechas');
    } else {
      const fechas = {
        fechaInicio: form.value.start?.toISOString(),
        fechaFinal: form.value.end?.toISOString(),
        labId: this.labIdControl.value.id,
        lab: this.labIdControl.value.codigoDeLab
      };

      this._datos.obtenerFecha(fechas);
    }
  }

  onNo() {
    this.dialogRef.close();
  }
}

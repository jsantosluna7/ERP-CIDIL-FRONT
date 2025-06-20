import { Component, Inject, model } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DatosService } from '../../../../../../services/Datos/datos.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-timer-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './timer-dialog.component.html',
  styleUrl: './timer-dialog.component.css',
})
export class TimerDialogComponent {
  minutosForm: FormGroup;
  readonly selection = model(true);

  constructor(
    public dialogRef: MatDialogRef<TimerDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      titulo: string;
    },
    private _toastr: ToastrService,
    private _datos: DatosService
  ) {
    this.minutosForm = new FormGroup({
      minutos: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  minutos() {
    const form = this.minutosForm;
    if (!form.valid) {
      this._toastr.error('Debe introducir los minutos');
    } else {
      const minutos = {
        segundos: this.formatearMinutos(form.value.minutos),
      };
      this._datos.timerFecha(minutos);
    }
  }

  formatearMinutos(minutos: number): number{
    const calculo = minutos * 3600;
    return calculo;
  }

  onNo() {
    this.dialogRef.close();
  }
}

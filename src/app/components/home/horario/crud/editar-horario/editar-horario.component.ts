import { CommonModule } from '@angular/common';
import { Component, Inject, model, OnInit } from '@angular/core';
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
import { HorarioService } from '../../../../../services/Api/Horario/horario.service';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { error } from 'console';
import { UtilitiesService } from '../../../../../services/Utilities/utilities.service';

@Component({
  selector: 'app-editar-horario',
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
  templateUrl: './editar-horario.component.html',
  styleUrl: './editar-horario.component.css',
})
export class EditarHorarioComponent implements OnInit {
  editarForm: FormGroup;
  readonly selection = model(true);
  laboratorios: any[] = [];
  labLoading: boolean = false;
  cambio: boolean = false;
  idLab: any;

  endpoint: string = `${process.env['API_URL']}${process.env['ENDPOINT_LABORATORIO']}`;
  endpointHorario: string = `${process.env['API_URL']}${process.env['ENDPOINT_HORARIO']}`;

  constructor(
    public dialogRef: MatDialogRef<EditarHorarioComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: string;
      asignatura: string;
      profesor: string;
      laboratorio: string;
      idLabEdit: string;
      dia: string;
      horaInicio: string;
      horaFinal: string;
      fechaInicio: string;
      fechaFinal: string;
    },
    private _horario: HorarioService,
    private _toastr: ToastrService,
    private _utilities: UtilitiesService
  ) {
    this.editarForm = new FormGroup({
      asignatura: new FormControl(data.asignatura, [Validators.required]),
      profesor: new FormControl(data.profesor, [Validators.required]),
      laboratorio: new FormControl(data.laboratorio, [Validators.required]),
      dia: new FormControl(data.dia, [Validators.required]),
      horaInicio: new FormControl(data.horaInicio, [Validators.required]),
      horaFinal: new FormControl(data.horaFinal, [Validators.required]),
      fechaInicio: new FormControl(data.fechaInicio, [Validators.required]),
      fechaFinal: new FormControl(data.fechaFinal, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this._horario.getAllLaboratorio(this.endpoint).subscribe({
      next: (e) => {
        this.laboratorios = e;
        this.labLoading = false;
      },
      error: (err) => {
        this._toastr.error(err.error, 'Hubo un error');
        this.labLoading = false;
      },
    });

    this.editarForm.get('laboratorio')!.valueChanges.subscribe((id) => {
      this.idLab = id;
      this.cambio = true;
    });
  }

  datos() {
    var todoData: any;
    const form = this.editarForm.value;
    var inicioISO = new Date(form.fechaInicio).toISOString();
    var finISO = new Date(form.fechaFinal).toISOString();

    var horainicio = this._utilities.desformatearHora(form.horaInicio);
    var horafin = this._utilities.desformatearHora(form.horaFinal);

    //Si se cambio el valor del select
    if (this.cambio) {
      todoData = {
        asignatura: form.asignatura,
        profesor: form.profesor,
        idLaboratorio: this.idLab,
        horaInicio: horainicio,
        horaFinal: horafin,
        fechaInicio: inicioISO,
        fechaFinal: finISO,
        dia: form.dia,
      };
    } else {
      todoData = {
        asignatura: form.asignatura,
        profesor: form.profesor,
        idLaboratorio: this.data.idLabEdit,
        horaInicio: horainicio,
        horaFinal: horafin,
        fechaInicio: inicioISO,
        fechaFinal: finISO,
        dia: form.dia,
      };
    }

    console.log(todoData);
    this._horario
      .putHorario(this.endpointHorario, this.data.id, todoData)
      .subscribe({
        next: (e) => {
          console.log(e);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  onNo() {
    this.dialogRef.close();
  }
}

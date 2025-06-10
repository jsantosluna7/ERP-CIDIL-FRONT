import { CommonModule } from '@angular/common';
import { Component, Inject, model, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
    MatProgressSpinnerModule
  ],
  templateUrl: './editar-horario.component.html',
  styleUrl: './editar-horario.component.css',
})
export class EditarHorarioComponent implements OnInit {
  editarForm: FormGroup;
  readonly selection = model(true);
  laboratorios: any[] = [];
  labLoading: boolean = false;
  idLab: any;


  endpoint: string = `${process.env['API_URL']}${process.env['ENDPOINT_LABORATORIO']}`;

  constructor(
    public dialogRef: MatDialogRef<EditarHorarioComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: string;
      asignatura: string;
      profesor: string;
      laboratorio: string;
      dia: string;
      horaInicio: string;
      horaFinal: string;
    },
    private _horario: HorarioService,
    private _toastr: ToastrService
  ) {
    this.editarForm = new FormGroup({
      asignatura: new FormControl(data.asignatura, [Validators.required]),
      profesor: new FormControl(data.profesor, [Validators.required]),
      laboratorio: new FormControl(data.laboratorio, [Validators.required]),
      dia: new FormControl(data.dia, [Validators.required]),
      horaInicio: new FormControl(data.horaInicio, [Validators.required]),
      horaFinal: new FormControl(data.horaFinal, [Validators.required])
    })
  }

  ngOnInit(): void {
    this._horario.getAllLaboratorio(this.endpoint).subscribe({
      next: (e) => {
        this.laboratorios = e
        this.labLoading = false
      }, error: (err) => {
        this._toastr.error(err.error, 'Hubo un error');
        this.labLoading = false
      } 
    })

    this.editarForm.get('laboratorio')!.valueChanges.subscribe(id => {
      this.idLab = id;
      // console.log(this.idLab)
    })
  }

  datos(){
    console.log(this.editarForm.value);
    console.log(this.laboratorios);
  }

  onNo() {
    this.dialogRef.close();
  }
}

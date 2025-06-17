import { Component, Inject, model } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-error-solapamiento',
  imports: [MatListModule, MatDividerModule],
  templateUrl: './error-solapamiento.component.html',
  styleUrl: './error-solapamiento.component.css',
})
export class ErrorSolapamientoComponent {
  readonly selection = model(true);
  laboratorios: any[] = [];
  labLoading: boolean = false;
  cambio: boolean = false;
  idLab: any;

  endpoint: string = `${process.env['API_URL']}${process.env['ENDPOINT_LABORATORIO']}`;
  endpointHorario: string = `${process.env['API_URL']}${process.env['ENDPOINT_HORARIO']}`;

  constructor(
    public dialogRef: MatDialogRef<ErrorSolapamientoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      titulo?: string;
      listaErrores: any[];
    }
  ) // private _toastr: ToastrService
  {}

  onNo() {
    this.dialogRef.close();
  }
}

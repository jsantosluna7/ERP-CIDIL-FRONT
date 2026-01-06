import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

export interface Ordenes {
  id: number;
}

@Component({
  selector: 'app-actualizar-estatus-compra',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
  ],
  templateUrl: './actualizar-estatus-compra.component.html',
  styleUrl: './actualizar-estatus-compra.component.css',
})
export class ActualizarEstatusCompraComponent {
  readonly dialogRef = inject(MatDialogRef<ActualizarEstatusCompraComponent>);
  readonly data = inject<Ordenes>(MAT_DIALOG_DATA);
  readonly id = model(this.data.id);

  onNoCancelar(): void {
    this.dialogRef.close();
  }

  onSiActualizar(): void {}
}

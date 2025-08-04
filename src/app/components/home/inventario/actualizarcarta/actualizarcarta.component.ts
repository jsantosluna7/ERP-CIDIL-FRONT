import { ApplicationModule, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { InventarioService } from '../../../../services/Inventario/inventario.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
@Component({
  selector: 'app-actualizarcarta',
  imports: [ MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule, ReactiveFormsModule,MatSlideToggleModule],
  templateUrl: './actualizarcarta.component.html',
  styleUrl: './actualizarcarta.component.css'
})
export class ActualizarcartaComponent {

  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ActualizarcartaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private inventarioService: InventarioService
  ) {
  this.form = this.fb.group({
  nombre: [data.nombre || '', Validators.required],
  nombreCorto: [data.nombreCorto || '', Validators.required],
  perfil: [data.perfil || '', Validators.required],
  idLaboratorio: [data.idLaboratorio || 0],
  fabricante: [data.fabricante || ''],
  modelo: [data.modelo || ''],
  serial: [data.serial || ''],
  descripcionLarga: [data.descripcionLarga || ''],
  fechaTransaccion: [data.fechaTransaccion || new Date().toISOString()],
  departamento: [data.departamento || ''],
  importeActivo: [data.importeActivo || 0],
  imagenEquipo: [data.imagenEquipo || ''],
  disponible: [data.disponible ?? true],
  idEstadoFisico: [data.idEstadoFisico || 0],
  validacionPrestamo: [data.validacionPrestamo ?? true],
  cantidad: [data.cantidad ?? 0],
  activado: [data.activado ?? true]
});

   
  }


guardar(): void {
  const actualizada = {
    ...this.form.value,
    id: this.data.id
  };

  this.inventarioService.actualizarCarta(this.data.id, actualizada).subscribe({
    next: () => {
      this.dialogRef.close(actualizada);
    },
    error: (err) => {
      console.error(' Error al actualizar:', err);
      alert('Error al actualizar la carta.');
    }
  });
}




  cancelar(): void {
    this.dialogRef.close();
  }









}

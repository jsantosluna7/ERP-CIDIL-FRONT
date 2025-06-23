
import {ChangeDetectionStrategy, Component, Inject, inject, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Usuarios } from '../../../../../interfaces/usuarios.interface';
import { UsuarioService } from '../usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuario-dialog',
  imports: [MatIconModule,MatButtonModule,MatFormFieldModule, MatSelectModule,MatButtonModule,MatDialogModule, ReactiveFormsModule ],
  templateUrl: './usuario-dialog.component.html',
  styleUrl: './usuario-dialog.component.css'
})
export class UsuarioDialogComponent implements OnInit {

    usuarioForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<UsuarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public usuario: Usuarios
  ) {}
 


  ngOnInit(): void {
  this.usuarioForm = this.fb.group({
    id: [this.usuario.id],
    idMatricula: [this.usuario.idMatricula, Validators.required],
    nombreUsuario: [this.usuario.nombreUsuario, Validators.required],
    apellidoUsuario: [this.usuario.apellidoUsuario, Validators.required],
    correoInstitucional: [this.usuario.correoInstitucional, [Validators.required, Validators.email]],
    telefono: [this.usuario.telefono, Validators.required],
    direccion: [this.usuario.direccion],
    idRol: [this.usuario.idrol, Validators.required],
    fechaCreacion: [this.usuario.fechaCreacion],
    fechaUltimaModificacion: [new Date().toISOString()] // actualizamos la fecha de modificación
  });
}


   guardarCambios() {
    if (this.usuarioForm.valid) {
      const datosActualizados = {
        idMatricula: this.usuarioForm.value.idMatricula,
        nombreUsuario: this.usuarioForm.value.nombreUsuario,
        apellidoUsuario: this.usuarioForm.value.apellidoUsuario,
        correoInstitucional: this.usuarioForm.value.correoInstitucional,
        telefono: this.usuarioForm.value.telefono,
        direccion: this.usuarioForm.value.direccion,
        idRol: this.usuarioForm.value.idRol,
        fechaCreacion: this.usuario.fechaCreacion, // se mantiene
        fechaUltimaModificacion: new Date().toISOString() // se actualiza
      };
        console.log('Payload actualizado:', datosActualizados);
      this.usuarioService.actualizarUsuario(this.usuario.id, datosActualizados).subscribe({
        next: () => {
          this.toastr.success('Usuario actualizado correctamente');
          this.dialogRef.close(true); // puedes usar esto para recargar la tabla
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Error al actualizar el usuario');
        }
      });
    } else {
      this.toastr.warning('Formulario inválido');
    }
  }


  cancelar() {
    this.dialogRef.close();
  }





  
}

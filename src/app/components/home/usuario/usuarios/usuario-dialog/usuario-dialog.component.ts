
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
  imports: [MatTableModule,MatSortModule,MatIconModule,MatButtonModule,MatFormFieldModule, MatSelectModule,MatButtonModule,MatDialogModule,MatButtonToggleModule,MatSlideToggleModule, ReactiveFormsModule ],
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
    // Inicializar el formulario con los datos del usuario
    this.usuarioForm = this.fb.group({
      id: [this.usuario.id],
      nombreUsuario: [this.usuario.nombreUsuario, Validators.required],
      apellidoUsuario: [this.usuario.apellidoUsuario, Validators.required],
      idMatricula: [this.usuario.idMatricula, Validators.required],
      telefono: [this.usuario.telefono, Validators.required],
      correoInstitucional: [this.usuario.correoInstitucional, [Validators.required, Validators.email]],
      direccion: [this.usuario.direccion],
      idRol: [this.usuario.idrol, Validators.required],
      activado: [this.usuario.activado]
    });
  }

    guardarCambios() {
  if (this.usuarioForm.valid) {
    const datosActualizados = this.usuarioForm.value;

    this.usuarioService.actualizarUsuario(datosActualizados.id, datosActualizados).subscribe({
      next: () => this.toastr.success('Usuario actualizado correctamente'),
      error: () => this.toastr.error('Error al actualizar el usuario')
    });
  } else {
    this.toastr.warning('Formulario inválido');
  }
}

  cancelar() {
    this.dialogRef.close();
  }



 /* cambiarRol(usuario: Usuarios) {
  const nuevoRol = prompt('Ingrese el nuevo rol (Estudiante, Administrador, Super Usuario):', usuario.idrol);
  const rolesValidos: Usuarios['idrol'][] = ['Estudiante', 'Administrador', 'Super Usuario'];

  if (nuevoRol && rolesValidos.includes(nuevoRol as Usuarios['idrol'])) {
    this.usuarioService.cambiarRol(usuario.id, nuevoRol as Usuarios['idrol']).subscribe({
      next: () => {
        this.toastr.success('Rol actualizado correctamente.');
        this.ngOnInit();
      },
      error: () => {
        this.toastr.error('Error al actualizar el rol.');
      }
    });
  } else if (nuevoRol) {
    this.toastr.warning('Rol inválido.');
  }
}*/
  


  
}

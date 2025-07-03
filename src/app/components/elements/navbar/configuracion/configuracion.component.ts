import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLocationDot, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { UsuarioService } from '../../../home/usuario/usuarios/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { Usuarios } from '../../../../interfaces/usuarios.interface';


@Component({
  selector: 'app-configuracion',
  imports: [MatButtonModule,MatDialogModule,FontAwesomeModule,ReactiveFormsModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguracionComponent {
  
  usuarioForm!: FormGroup;

   faUser = faUser;
   faLocationDot = faLocationDot;
   faPhone = faPhone;
   faEnvelope = faEnvelope;
  
   constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public usuario: Usuarios,
     private dialogRef: MatDialogRef<ConfiguracionComponent> 
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
    fechaUltimaModificacion: [new Date().toISOString()] 
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



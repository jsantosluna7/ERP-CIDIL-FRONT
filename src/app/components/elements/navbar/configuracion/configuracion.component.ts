import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEnvelope,
  faLocationDot,
  faPhone,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { UsuarioService } from '../../../home/usuario/usuarios/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { Usuarios } from '../../../../interfaces/usuarios.interface';
import { RolService } from '../../../../services/Api/Rol/rol.service';

@Component({
  selector: 'app-configuracion',
  imports: [
    MatButtonModule,
    MatDialogModule,
    FontAwesomeModule,
    ReactiveFormsModule,
  ],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguracionComponent {
  usuarioForm!: FormGroup;
  rol!: string;

  faUser = faUser;
  faLocationDot = faLocationDot;
  faPhone = faPhone;
  faEnvelope = faEnvelope;

  endpoint: string = `${process.env['API_URL']}${process.env['ENDPOINT_ROL']}`;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private _rol: RolService,
    private _toastr: ToastrService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public usuario: any,
    private dialogRef: MatDialogRef<ConfiguracionComponent>
  ) {
    this.usuarioForm = this.fb.group({
      id: [this.usuario.id],
      idMatricula: [this.usuario.idMatricula, Validators.required],
      nombreUsuario: [this.usuario.nombreUsuario, Validators.required],
      apellidoUsuario: [this.usuario.apellidoUsuario, Validators.required],
      correoInstitucional: [
        this.usuario.correoInstitucional,
        [Validators.required, Validators.email],
      ],
      telefono: [this.usuario.telefono, Validators.required],
      direccion: [this.usuario.direccion],
      rolNombre: ['', Validators.required],
      fechaCreacion: [this.usuario.fechaCreacion],
      fechaUltimaModificacion: [new Date().toISOString()],
    });
  }

  ngOnInit(): void {
    this._rol.getRol(this.endpoint, this.usuario.idRol).subscribe({
      next: (data) => {
        this.rol = data.rol;
        this.usuarioForm.get('rolNombre')?.setValue(data.rol);
      },
      error: (err) => {
        this._toastr.error('Hubo un error al obtener el rol', 'Hubo un error');
      },
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
        rolNombre: this.usuarioForm.value.idRol,
        fechaCreacion: this.usuario.fechaCreacion, // se mantiene
        fechaUltimaModificacion: new Date().toISOString(), // se actualiza
      };
      console.log('Payload actualizado:', datosActualizados);
      this.usuarioService
        .actualizarUsuario(this.usuario.id, datosActualizados)
        .subscribe({
          next: () => {
            this.toastr.success('Usuario actualizado correctamente');
            this.dialogRef.close(true); // puedes usar esto para recargar la tabla
          },
          error: (err) => {
            console.error(err);
            this.toastr.error('Error al actualizar el usuario');
          },
        });
    } else {
      this.toastr.warning('Formulario inválido');
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}

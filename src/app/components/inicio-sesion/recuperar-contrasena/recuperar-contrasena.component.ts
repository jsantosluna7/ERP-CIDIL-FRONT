import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recuperar-contrasena',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrl: './recuperar-contrasena.component.css',
})
export class RecuperarContrasenaComponent {
  /** Formulario reactivo equivalente al <form> del HTML original */
  resetForm: FormGroup;
  loading: boolean = false;

  //ENDPOINTS
  olvide = `${process.env['API_URL']}${process.env['ENDPOINT_OLVIDE_CONTRASENA']}`;

  constructor(
    private fb: FormBuilder,
    private _usuarios: UsuariosService,
    private _toastr: ToastrService,
    private _router: Router,
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    this.loading = true;

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const data = {
      correoInstitucional: this.resetForm.value.email,
    };

    this._usuarios.olvideContrasena(this.olvide, data).subscribe({
      next: (e) => {
        this._toastr.success(
          'Correo enviado con éxito, revisa tu bandeja',
          'Éxito',
        );
        this._router.navigate(['/acceso/login']);
      },
      error: (e) => {
        this._toastr.error(e.error, 'Hubo un Error');
      },
    });
  }
}

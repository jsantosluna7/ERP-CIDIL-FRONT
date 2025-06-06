import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { BackButtonComponent } from "../../elements/back-button/back-button.component";
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-contrasena',
  imports: [ReactiveFormsModule, FontAwesomeModule, BackButtonComponent],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrl: './recuperar-contrasena.component.css'
})
export class RecuperarContrasenaComponent {

  faEnvelope = faEnvelope;
  recuperarContrasenaForm: FormGroup;

  //ENDPOINTS
  olvide = `${process.env['API_URL']}${process.env['ENDPOINT_OLVIDE_CONTRASENA']}`

  constructor(private _usuarios: UsuariosService, private _toastr: ToastrService, private _router: Router) {
    this.recuperarContrasenaForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  olvideContrasena() {
    const data = {
      "correoInstitucional": this.recuperarContrasenaForm.value.email
    }
    this._usuarios.olvideContrasena(this.olvide, data).subscribe({
      next: (e) => {
        this._toastr.success('Correo enviado con éxito, revisa tu bandeja', 'Éxito');
        this._router.navigate(['login'])
      }, error: (e) => {
        console.log(e);
        this._toastr.error(e.error, 'Hubo un Error');
      }
    })
  }
}

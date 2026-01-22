import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatButton } from '@angular/material/button';
import { ComprasService } from '../../../services/Api/compras.service';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { AppCualRolDirective } from '../../../directives/app-cual-rol.directive';
import { ComprasAdminComponent } from "./compras-admin/compras-admin.component";
import { ComprasReadonlyComponent } from "./compras-readonly/compras-readonly.component";

@Component({
  selector: 'app-compras',
  imports: [CommonModule, MatButton, AppCualRolDirective, ComprasAdminComponent, ComprasReadonlyComponent],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css',
})
export class ComprasComponent {
  modoVista = signal<'admin' | 'readonly'>('admin');
  usuarioLogueado: any;
  usuarioRol: number = 0;

  ROLES_ADMIN = [1, 5];
  ROL_LECTURA = 2;

  constructor(
    private dialog: MatDialog,
    private _toastr: ToastrService,
    private _compras: ComprasService,
    private _usuarios: UsuariosService
  ) {
    this._usuarios.user$.subscribe((user) => {
      this.usuarioLogueado = user;
      this.usuarioRol = Number(user.idRol);
    });

    const rol = Number(this.usuarioLogueado.idRol);

    // Si es rol lectura, forzar vista readonly
    if (rol === this.ROL_LECTURA) {
      this.modoVista.set('readonly');
    }
  }

  cambiarModo() {
    this.modoVista.set(this.modoVista() === 'admin' ? 'readonly' : 'admin');
  }
}

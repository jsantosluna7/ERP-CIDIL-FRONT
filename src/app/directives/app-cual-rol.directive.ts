import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { UsuariosService } from '../services/Api/Usuarios/usuarios.service';

@Directive({
  selector: '[appCualRol]',
  standalone: true,
})
export class AppCualRolDirective {
  constructor(
    private template: TemplateRef<any>,
    private view: ViewContainerRef,
    private _usuarios: UsuariosService
  ) {}

  @Input() set appCualRol(rolesPermitidos: number[]) {
    const usuario = this._usuarios.userSubject.value;

    if (usuario && rolesPermitidos.includes(Number(usuario.idRol))) {
      this.view.createEmbeddedView(this.template);
    } else {
      this.view.clear();
    }
  }
}

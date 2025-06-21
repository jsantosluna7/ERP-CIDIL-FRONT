import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { UsuarioService } from '../../home/usuario/usuarios/usuarios.service';
import { Usuarios } from '../../../interfaces/usuarios.interface';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';

@Component({
  selector: 'app-navbar',
  imports: [FontAwesomeModule, RouterLink, MatButtonModule,MatDialogModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  left =faArrowRightFromBracket;
   readonly dialog = inject(MatDialog);
   readonly usuarioService = inject(UsuariosService);

   usuarioLogueado!: Usuarios;

 ngOnInit(): void {
    // Obtenemos el usuario al cargar el navbar
    this.usuarioService.user$.subscribe(usuario => {
      if (usuario) {
        this.usuarioLogueado = usuario;
      }
    });
    console.log(this.usuarioLogueado);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfiguracionComponent, {
      data: this.usuarioLogueado,
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }



}




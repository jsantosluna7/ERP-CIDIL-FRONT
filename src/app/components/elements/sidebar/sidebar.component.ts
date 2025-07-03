import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faClock,
  faArrowRightFromBracket,
  faBell,
  faCartShopping,
  faChartSimple,
  faDesktop,
  faGreaterThan,
  faHeart,
  faHouse,
  faMagnifyingGlass,
  faMicrochip,
  faShop,
  faUser,
  faCalendar,
  faFlask,
  faToolbox,
} from '@fortawesome/free-solid-svg-icons';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { AppCualRolDirective } from '../../../directives/app-cual-rol.directive';
import { ConfiguracionComponent } from '../navbar/configuracion/configuracion.component';
import { MatDialog } from '@angular/material/dialog';
import { Usuarios } from '../../../interfaces/usuarios.interface';
import { take } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [FontAwesomeModule, CommonModule, RouterLink, AppCualRolDirective],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  arrowright = faGreaterThan;
  house = faHouse;
  solid = faMagnifyingGlass;
  heart = faDesktop;
  regular = faChartSimple;
  bell = faBell;
  credi = faUser;
  car = faShop;
  left = faArrowRightFromBracket;
  iot = faMicrochip;
  faclok = faClock;
  carro = faCartShopping;

  // body = document.querySelector(".body");k
  //  sidebar=this.body?.querySelector(".sidebar");
  //  toggle = this.body?.querySelector(".toggle");
  //  searchBtn = this.body?.querySelector(".search-box");

  // toogle(event: any){
  //   const elemento:any = document.querySelector(".sidebar");
  //   // console.log(elemento)
  //   elemento.classList.toggle("close");

  // }

  constructor(
    private _usuarios: UsuariosService,
    private _router: Router,
    private dialog: MatDialog,
    private usuarioService: UsuariosService
  ) {}

  usuarioLogueado!: Usuarios;

  ngOnInit(): void {
    this.usuarioService.user$.subscribe((usuario) => {
      if (usuario) {
        this.usuarioLogueado = usuario;
      }
    });
    console.log(this.usuarioLogueado);
  }

  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleClick() {
    this.toggleSidebar.emit();
    const elemento: any = document.querySelector('.sidebar');
    elemento.classList.toggle('close');
  }

  salir() {
    this._usuarios.cerrarSesion();
    this._router.navigate(['/login']);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfiguracionComponent, {
      data: this.usuarioLogueado,
      width: '600px',
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
  }
}

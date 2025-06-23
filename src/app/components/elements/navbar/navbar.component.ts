import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClock, faArrowRightFromBracket, faBell, faChartSimple, faDesktop, faGreaterThan, faHouse, faMagnifyingGlass, faMicrochip, faShop, faUser, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { AppCualRolDirective } from '../../../directives/app-cual-rol.directive';

@Component({
  selector: 'app-navbar',
  imports: [FontAwesomeModule, CommonModule, RouterLink, AppCualRolDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private _usuarios: UsuariosService, private _router: Router){}

   arrowright = faGreaterThan;
   house = faHouse;
   solid =faMagnifyingGlass;
   heart =faDesktop;
   regular =faChartSimple;
   bell = faBell;
   credi = faUser;
   car = faShop;
   left = faArrowRightFromBracket;
   iot =faMicrochip;
   faclok = faClock;
   calendar = faCalendar;

  // body = document.querySelector(".body");k
  //  sidebar=this.body?.querySelector(".sidebar");
  //  toggle = this.body?.querySelector(".toggle");
  //  searchBtn = this.body?.querySelector(".search-box");

  // toogle(event: any){
  //   const elemento:any = document.querySelector(".sidebar");
  //   // console.log(elemento)
  //   elemento.classList.toggle("close");

  // }

  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleClick(){
    this.toggleSidebar.emit();
    const elemento:any = document.querySelector(".sidebar");
    elemento.classList.toggle("close");
  }

  salir(){
    this._usuarios.cerrarSesion()
    this._router.navigate(['/login']);
  }


}

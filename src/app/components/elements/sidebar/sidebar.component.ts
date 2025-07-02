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
  faFlask,
  faToolbox,
} from '@fortawesome/free-solid-svg-icons';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';

@Component({
  selector: 'app-sidebar',
  imports: [FontAwesomeModule, CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit{
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
  laboratorio = faFlask;
  equipo = faToolbox;

  // body = document.querySelector(".body");k
  //  sidebar=this.body?.querySelector(".sidebar");
  //  toggle = this.body?.querySelector(".toggle");
  //  searchBtn = this.body?.querySelector(".search-box");

  // toogle(event: any){
  //   const elemento:any = document.querySelector(".sidebar");
  //   // console.log(elemento)
  //   elemento.classList.toggle("close");

  // }

  constructor(private _usuarios: UsuariosService, private _router: Router){}

  ngOnInit(): void {
    this._usuarios.user$.subscribe(e => {
     
    })

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
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight,faClock, faArrowRightFromBracket, faBell, faCartShopping, faChartSimple, faCreditCard, faDesktop, faGreaterThan, faHeart, faHouse, faMagnifyingGlass, faMicrochip, faShop, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  imports: [FontAwesomeModule, CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

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
   carro =faCartShopping;

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



}

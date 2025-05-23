import { Component, EventEmitter, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faArrowRightFromBracket, faBell, faCartShopping, faChartSimple, faCreditCard, faDesktop, faGreaterThan, faHeart, faHouse, faMagnifyingGlass, faMicrochip, faShop, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  imports: [FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

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

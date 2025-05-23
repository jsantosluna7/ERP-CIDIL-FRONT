import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faArrowRightFromBracket, faBell, faCartShopping, faChartSimple, faCreditCard, faHeart, faHouse, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  imports: [FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

   arrowright = faArrowRight;
   house = faHouse;
   solid =faMagnifyingGlass;
   heart =faHeart;
   regular =faChartSimple;
   bell = faBell;
   credi = faCreditCard;
   car = faCartShopping;
   left = faArrowRightFromBracket;

  // body = document.querySelector(".body");k
  //  sidebar=this.body?.querySelector(".sidebar");
  //  toggle = this.body?.querySelector(".toggle");
  //  searchBtn = this.body?.querySelector(".search-box");

  toogle(event: any){
    const elemento:any = document.querySelector(".sidebar");
    // console.log(elemento)
    elemento.classList.toggle("close");

  }



}

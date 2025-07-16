import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppCualRolDirective } from '../../../directives/app-cual-rol.directive';
import { MatIconModule } from '@angular/material/icon';
import {
  faArrowRightFromBracket,
  faBell,
  faCalendar,
  faCartShopping,
  faChartSimple,
  faClock,
  faDesktop,
  faFlask,
  faGear,
  faGreaterThan,
  faHouse,
  faMagnifyingGlass,
  faMicrochip,
  faShop,
  faToolbox,
  faUser,
  faWarehouse,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { ConfiguracionComponent } from '../navbar/configuracion/configuracion.component';

interface DropdownItem {
  label: string;
  icon: string;
  isOpen: boolean;
  links: string[];
  height?: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterLink,
    AppCualRolDirective,
    MatIconModule,
    FontAwesomeModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent implements OnInit, AfterViewInit {
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
  calendar = faCalendar;
  inventario = faWarehouse;
  config = faGear;

  constructor(
    private elRef: ElementRef,
    private _usuarios: UsuariosService,
    private _router: Router,
    private dialog: MatDialog,
    private usuarioService: UsuariosService
  ) {}

  usuarioLogueado!: any;
  nombreUsuario: string = '';

  ngOnInit(): void {
    this.usuarioService.user$.subscribe((usuario) => {
      if (usuario) {
        this.usuarioLogueado = usuario;

        this.nombreUsuario = `${usuario.nombreUsuario} ${usuario.apellidoUsuario}`;
      }
    });
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
      .subscribe((result) => {});
  }

  ngAfterViewInit(): void {
    const toggleDropdown = (
      dropdown: HTMLElement,
      menu: HTMLElement,
      isOpen: boolean
    ): void => {
      dropdown.classList.toggle('open', isOpen);
      if (isOpen) {
        menu.style.height = menu.scrollHeight + 'px';
        // fuerza recálculo y luego vuelve a auto
        setTimeout(() => (menu.style.height = 'auto'), 300);
      } else {
        menu.style.height = menu.scrollHeight + 'px';
        // fuerza que vuelva a 0 con transición
        requestAnimationFrame(() => (menu.style.height = '0'));
      }
    };

    const closeAllDropdowns = (): void => {
      const openDropdowns = this.elRef.nativeElement.querySelectorAll(
        '.dropdown-container-sd.open'
      );
      openDropdowns.forEach((openDropdown: Element) => {
        const menu = openDropdown.querySelector(
          '.dropdown-menu-sd'
        ) as HTMLElement;
        if (menu) {
          toggleDropdown(openDropdown as HTMLElement, menu, false);
        }
      });
    };

    const dropdownToggles = this.elRef.nativeElement.querySelectorAll(
      '.dropdown-toggle-sd'
    );
    dropdownToggles.forEach((dropdownToggle: Element) => {
      dropdownToggle.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const dropdown = dropdownToggle.closest(
          '.dropdown-container-sd'
        ) as HTMLElement;
        const menu = dropdown.querySelector('.dropdown-menu-sd') as HTMLElement;
        const isOpen = dropdown.classList.contains('open');
        closeAllDropdowns();
        toggleDropdown(dropdown, menu, !isOpen);
      });
    });

    const sidebarButtons = this.elRef.nativeElement.querySelectorAll(
      '.sidebar-toggler-sd, .sidebar-menu-button'
    );
    sidebarButtons.forEach((button: Element) => {
      button.addEventListener('click', () => {
        closeAllDropdowns();
        const sidebar = this.elRef.nativeElement.querySelector(
          '.sidebar'
        ) as HTMLElement;
        sidebar?.classList.toggle('collapsed');
      });
    });

    // Collapse on small screens
    const sidebar = this.elRef.nativeElement.querySelector(
      '.sidebar'
    ) as HTMLElement;
    if (window.innerWidth <= 1024 && sidebar) {
      sidebar.classList.add('collapsed');
    }
  }
}

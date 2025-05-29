import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { ConfiguracionComponent } from './configuracion/configuracion.component';

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

   
  openDialog() {
    const dialogRef = this.dialog.open(ConfiguracionComponent);
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }




}

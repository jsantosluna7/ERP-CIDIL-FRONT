import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FileDialogComponent } from './dialog/file-dialog/file-dialog.component';

@Component({
  selector: 'app-horario',
  imports: [],
  templateUrl: './horario.component.html',
  styleUrl: './horario.component.css'
})
export class HorarioComponent {
  constructor(private dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(FileDialogComponent, {
      height: '600px',
      data: { name: 'Usuario' },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo fue cerrado');
    });
  }
}

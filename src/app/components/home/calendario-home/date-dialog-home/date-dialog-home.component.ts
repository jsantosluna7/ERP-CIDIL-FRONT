import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-date-dialog-home',
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './date-dialog-home.component.html',
  styleUrl: './date-dialog-home.component.css',
})
export class DateDialogHomeComponent {
  constructor(
    public dialogRef: MatDialogRef<DateDialogHomeComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      info: any[];
    }
  ) {}

  onOk() {
    this.dialogRef.close();
  }
}

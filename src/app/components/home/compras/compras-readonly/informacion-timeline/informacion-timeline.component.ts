import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface OrdenesInfo {
  id: number;
}

@Component({
  selector: 'app-informacion-timeline',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './informacion-timeline.component.html',
  styleUrl: './informacion-timeline.component.css',
})
export class InformacionTimelineComponent {
    readonly dialogRef = inject(MatDialogRef<InformacionTimelineComponent>);
  readonly data = inject<OrdenesInfo>(MAT_DIALOG_DATA);
  readonly id = model(this.data.id);
  
  onNoCancelar(): void {
    this.dialogRef.close();
  }

  onSiActualizar(): void {}
}

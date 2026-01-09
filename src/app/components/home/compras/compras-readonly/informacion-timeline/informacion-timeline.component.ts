import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  faAngleDown,
  faAngleRight,
  faArrowRight,
  faBox,
  faBoxesPacking,
  faBoxOpen,
  faBuilding,
  faCalendar,
  faCartShopping,
  faCircleCheck,
  faCircleXmark,
  faClipboard,
  faClipboardCheck,
  faFile,
  faMagnifyingGlass,
  faMessage,
  faTruck,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { C } from "../../../../../../../node_modules/@angular/cdk/a11y-module.d-DBHGyKoh";

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
    MatIconModule,
    FaIconComponent
],
  templateUrl: './informacion-timeline.component.html',
  styleUrl: './informacion-timeline.component.css',
})
export class InformacionTimelineComponent {
  file = faFile;
  lupa = faMagnifyingGlass;
  clipCheck = faClipboardCheck;
  cartShopping = faCartShopping;
  camion = faTruck;
  boxOpen = faBoxOpen;
  boxPacking = faBoxesPacking;
  circleCheck = faCircleCheck;
  circleXmark = faCircleXmark;

  calendar = faCalendar;
  upload = faUpload;
  box = faBox;
  dep = faBuilding;
  mensaje = faMessage;
  angelRight = faAngleRight;
  angelDown = faAngleDown;
  clip = faClipboard;

  arrowRight = faArrowRight;

  readonly dialogRef = inject(MatDialogRef<InformacionTimelineComponent>);
  readonly data = inject<OrdenesInfo>(MAT_DIALOG_DATA);
  readonly id = model(this.data.id);

  onNoCancelar(): void {
    this.dialogRef.close();
  }

  onSiActualizar(): void {}
}

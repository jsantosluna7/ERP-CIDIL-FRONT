import { Component, HostListener, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { UtilitiesService } from '../../../services/Utilities/utilities.service';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error-list',
  imports: [MatListModule, MatTabsModule, MatDividerModule],
  templateUrl: './error-list.component.html',
  styleUrl: './error-list.component.css',
})
export class ErrorListComponent implements OnInit {
  allErrors: any[] = [];
  private storageKey = '';

  allErrorsA: any[] = [];
  allErrorsB: any[] = [];
  allErrorsC: any[] = [];

  constructor(
    public _utilities: UtilitiesService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.storageKey = this._route.snapshot.queryParamMap.get('key') || '';
    const raw = localStorage.getItem(this.storageKey);
    this.allErrors = raw ? JSON.parse(raw) : [];

    this.allErrors.forEach((error) => {
      if (error.idError === 1) {
        this.allErrorsA.push(error);
      } else if (error.idError === 2) {
        this.allErrorsB.push(error);
      } else {
        this.allErrorsC.push(error);
      }
    });
  }

  @HostListener('window:beforeunload')
  onTabClose() {
    if (this.storageKey) {
      localStorage.removeItem(this.storageKey);
    }
  }
}

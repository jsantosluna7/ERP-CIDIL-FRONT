import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasAdminComponent } from './compras-admin.component';

describe('ComprasAdminComponent', () => {
  let component: ComprasAdminComponent;
  let fixture: ComponentFixture<ComprasAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprasAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

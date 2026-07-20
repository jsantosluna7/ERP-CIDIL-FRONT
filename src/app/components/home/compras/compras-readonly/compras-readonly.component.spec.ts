import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasReadonlyComponent } from './compras-readonly.component';

describe('ComprasReadonlyComponent', () => {
  let component: ComprasReadonlyComponent;
  let fixture: ComponentFixture<ComprasReadonlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprasReadonlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprasReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

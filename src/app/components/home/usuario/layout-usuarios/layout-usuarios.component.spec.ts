import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutUsuariosComponent } from './layout-usuarios.component';

describe('LayoutUsuariosComponent', () => {
  let component: LayoutUsuariosComponent;
  let fixture: ComponentFixture<LayoutUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

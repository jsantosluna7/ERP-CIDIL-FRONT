import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarcartaComponent } from './actualizarcarta.component';

describe('ActualizarcartaComponent', () => {
  let component: ActualizarcartaComponent;
  let fixture: ComponentFixture<ActualizarcartaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarcartaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarcartaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

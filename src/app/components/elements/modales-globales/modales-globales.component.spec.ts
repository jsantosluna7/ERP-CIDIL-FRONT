import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalesGlobalesComponent } from './modales-globales.component';

describe('ModalesGlobalesComponent', () => {
  let component: ModalesGlobalesComponent;
  let fixture: ComponentFixture<ModalesGlobalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalesGlobalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalesGlobalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

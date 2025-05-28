import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersWidgetComponent } from './users-widget.component';

describe('UsersWidgetComponent', () => {
  let component: UsersWidgetComponent;
  let fixture: ComponentFixture<UsersWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

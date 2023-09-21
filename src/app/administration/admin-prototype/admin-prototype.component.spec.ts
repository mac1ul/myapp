import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPrototypeComponent } from './admin-prototype.component';

describe('AdminPrototypeComponent', () => {
  let component: AdminPrototypeComponent;
  let fixture: ComponentFixture<AdminPrototypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPrototypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPrototypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

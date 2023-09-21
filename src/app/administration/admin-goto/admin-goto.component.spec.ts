import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGotoComponent } from './admin-goto.component';

describe('AdminGotoComponent', () => {
  let component: AdminGotoComponent;
  let fixture: ComponentFixture<AdminGotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminGotoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

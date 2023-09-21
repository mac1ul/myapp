import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStockofsiComponent } from './admin-stockofsi.component';

describe('AdminStockofsiComponent', () => {
  let component: AdminStockofsiComponent;
  let fixture: ComponentFixture<AdminStockofsiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminStockofsiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminStockofsiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

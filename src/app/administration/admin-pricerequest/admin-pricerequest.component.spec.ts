import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPricerequestComponent } from './admin-pricerequest.component';

describe('AdminPricerequestComponent', () => {
  let component: AdminPricerequestComponent;
  let fixture: ComponentFixture<AdminPricerequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPricerequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPricerequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

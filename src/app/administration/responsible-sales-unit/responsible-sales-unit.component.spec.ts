import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsibleSalesUnitComponent } from './responsible-sales-unit.component';

describe('ResponsibleSalesUnitComponent', () => {
  let component: ResponsibleSalesUnitComponent;
  let fixture: ComponentFixture<ResponsibleSalesUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponsibleSalesUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsibleSalesUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

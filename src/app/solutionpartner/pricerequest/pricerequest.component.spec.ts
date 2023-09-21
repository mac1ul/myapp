import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricerequestComponent } from './pricerequest.component';

describe('PricerequestComponent', () => {
  let component: PricerequestComponent;
  let fixture: ComponentFixture<PricerequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricerequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricerequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

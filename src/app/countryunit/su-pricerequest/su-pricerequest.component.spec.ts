import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuPricerequestComponent } from './su-pricerequest.component';

describe('SuPricerequestComponent', () => {
  let component: SuPricerequestComponent;
  let fixture: ComponentFixture<SuPricerequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuPricerequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuPricerequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

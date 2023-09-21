import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockofSIComponent } from './stockof-si.component';

describe('StockofSIComponent', () => {
  let component: StockofSIComponent;
  let fixture: ComponentFixture<StockofSIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockofSIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockofSIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

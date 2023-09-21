import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuStockofsiComponent } from './su-stockofsi.component';

describe('SuStockofsiComponent', () => {
  let component: SuStockofsiComponent;
  let fixture: ComponentFixture<SuStockofsiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuStockofsiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuStockofsiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

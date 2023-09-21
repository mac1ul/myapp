import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesunitOverviewComponent } from './salesunit-overview.component';

describe('SalesunitOverviewComponent', () => {
  let component: SalesunitOverviewComponent;
  let fixture: ComponentFixture<SalesunitOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesunitOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesunitOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

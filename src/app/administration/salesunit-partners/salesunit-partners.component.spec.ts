import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesunitPartnersComponent } from './salesunit-partners.component';

describe('SalesunitPartnersComponent', () => {
  let component: SalesunitPartnersComponent;
  let fixture: ComponentFixture<SalesunitPartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesunitPartnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesunitPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});



import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnersProjectdetailsComponent } from './partners-projectdetails.component';

describe('PartnersProjectdetailsComponent', () => {
  let component: PartnersProjectdetailsComponent;
  let fixture: ComponentFixture<PartnersProjectdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnersProjectdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnersProjectdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

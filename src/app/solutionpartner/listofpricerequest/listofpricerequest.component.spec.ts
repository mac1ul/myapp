import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListofpricerequestComponent } from './listofpricerequest.component';

describe('ListofpricerequestComponent', () => {
  let component: ListofpricerequestComponent;
  let fixture: ComponentFixture<ListofpricerequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListofpricerequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListofpricerequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

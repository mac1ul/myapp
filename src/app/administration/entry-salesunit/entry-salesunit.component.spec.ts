import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrySalesunitComponent } from './entry-salesunit.component';

describe('EntrySalesunitComponent', () => {
  let component: EntrySalesunitComponent;
  let fixture: ComponentFixture<EntrySalesunitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntrySalesunitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrySalesunitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

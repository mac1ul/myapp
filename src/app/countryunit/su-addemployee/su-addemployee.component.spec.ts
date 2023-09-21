import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuAddemployeeComponent } from './su-addemployee.component';

describe('SuAddemployeeComponent', () => {
  let component: SuAddemployeeComponent;
  let fixture: ComponentFixture<SuAddemployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuAddemployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuAddemployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

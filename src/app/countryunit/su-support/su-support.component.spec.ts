import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuSupportComponent } from './su-support.component';

describe('SuSupportComponent', () => {
  let component: SuSupportComponent;
  let fixture: ComponentFixture<SuSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuSupportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuAddsolutionpartnerComponent } from './su-addsolutionpartner.component';

describe('SuAddsolutionpartnerComponent', () => {
  let component: SuAddsolutionpartnerComponent;
  let fixture: ComponentFixture<SuAddsolutionpartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuAddsolutionpartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuAddsolutionpartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

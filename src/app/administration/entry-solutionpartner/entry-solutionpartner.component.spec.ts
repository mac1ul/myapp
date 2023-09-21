import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrySolutionpartnerComponent } from './entry-solutionpartner.component';

describe('EntrySolutionpartnerComponent', () => {
  let component: EntrySolutionpartnerComponent;
  let fixture: ComponentFixture<EntrySolutionpartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntrySolutionpartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrySolutionpartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

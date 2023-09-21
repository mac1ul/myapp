import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionPartnerHomeComponent } from './solution-partner-home.component';

describe('SolutionPartnerHomeComponent', () => {
  let component: SolutionPartnerHomeComponent;
  let fixture: ComponentFixture<SolutionPartnerHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolutionPartnerHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionPartnerHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

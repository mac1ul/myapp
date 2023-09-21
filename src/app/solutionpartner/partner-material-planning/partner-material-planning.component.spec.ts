import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerMaterialPlanningComponent } from './partner-material-planning.component';

describe('PartnerMaterialPlanningComponent', () => {
  let component: PartnerMaterialPlanningComponent;
  let fixture: ComponentFixture<PartnerMaterialPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerMaterialPlanningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerMaterialPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

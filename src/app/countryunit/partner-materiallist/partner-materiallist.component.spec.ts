import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerMateriallistComponent } from './partner-materiallist.component';

describe('PartnerMateriallistComponent', () => {
  let component: PartnerMateriallistComponent;
  let fixture: ComponentFixture<PartnerMateriallistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerMateriallistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerMateriallistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

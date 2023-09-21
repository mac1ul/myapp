import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectlistPartnerComponent } from './projectlist-partner.component';

describe('ProjectlistPartnerComponent', () => {
  let component: ProjectlistPartnerComponent;
  let fixture: ComponentFixture<ProjectlistPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectlistPartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectlistPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

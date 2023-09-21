import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsMachinedetailsComponent } from './projects-machinedetails.component';

describe('ProjectsMachinedetailsComponent', () => {
  let component: ProjectsMachinedetailsComponent;
  let fixture: ComponentFixture<ProjectsMachinedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectsMachinedetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsMachinedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

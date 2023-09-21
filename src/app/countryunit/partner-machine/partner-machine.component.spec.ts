import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerMachineComponent } from './partner-machine.component';

describe('PartnerMachineComponent', () => {
  let component: PartnerMachineComponent;
  let fixture: ComponentFixture<PartnerMachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerMachineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

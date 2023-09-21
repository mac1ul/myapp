import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinesMaterialsComponent } from './machines-materials.component';

describe('MachinesMaterialsComponent', () => {
  let component: MachinesMaterialsComponent;
  let fixture: ComponentFixture<MachinesMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachinesMaterialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachinesMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

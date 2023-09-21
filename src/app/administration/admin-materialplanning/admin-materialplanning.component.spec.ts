import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMaterialplanningComponent } from './admin-materialplanning.component';

describe('AdminMaterialplanningComponent', () => {
  let component: AdminMaterialplanningComponent;
  let fixture: ComponentFixture<AdminMaterialplanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminMaterialplanningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMaterialplanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

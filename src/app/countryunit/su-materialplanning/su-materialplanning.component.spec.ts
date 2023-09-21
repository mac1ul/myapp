import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuMaterialplanningComponent } from './su-materialplanning.component';

describe('SuMaterialplanningComponent', () => {
  let component: SuMaterialplanningComponent;
  let fixture: ComponentFixture<SuMaterialplanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuMaterialplanningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuMaterialplanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

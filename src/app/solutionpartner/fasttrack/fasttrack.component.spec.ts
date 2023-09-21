import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FasttrackComponent } from './fasttrack.component';

describe('FasttrackComponent', () => {
  let component: FasttrackComponent;
  let fixture: ComponentFixture<FasttrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FasttrackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FasttrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

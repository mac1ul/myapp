import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckdeliverytimeComponent } from './checkdeliverytime.component';

describe('CheckdeliverytimeComponent', () => {
  let component: CheckdeliverytimeComponent;
  let fixture: ComponentFixture<CheckdeliverytimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckdeliverytimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckdeliverytimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

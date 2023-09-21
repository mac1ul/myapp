import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuCheckdeliverytimeComponent } from './su-checkdeliverytime.component';

describe('SuCheckdeliverytimeComponent', () => {
  let component: SuCheckdeliverytimeComponent;
  let fixture: ComponentFixture<SuCheckdeliverytimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuCheckdeliverytimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuCheckdeliverytimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

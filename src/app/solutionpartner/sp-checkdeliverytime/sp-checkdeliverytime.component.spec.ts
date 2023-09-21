import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpCheckdeliverytimeComponent } from './sp-checkdeliverytime.component';

describe('SpCheckdeliverytimeComponent', () => {
  let component: SpCheckdeliverytimeComponent;
  let fixture: ComponentFixture<SpCheckdeliverytimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpCheckdeliverytimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpCheckdeliverytimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

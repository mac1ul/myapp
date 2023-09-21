import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuPrototypeComponent } from './su-prototype.component';

describe('SuPrototypeComponent', () => {
  let component: SuPrototypeComponent;
  let fixture: ComponentFixture<SuPrototypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuPrototypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuPrototypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

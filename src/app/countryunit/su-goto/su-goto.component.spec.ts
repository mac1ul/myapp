import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuGotoComponent } from './su-goto.component';

describe('SuGotoComponent', () => {
  let component: SuGotoComponent;
  let fixture: ComponentFixture<SuGotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuGotoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuGotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

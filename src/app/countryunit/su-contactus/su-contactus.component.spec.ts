import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuContactusComponent } from './su-contactus.component';

describe('SuContactusComponent', () => {
  let component: SuContactusComponent;
  let fixture: ComponentFixture<SuContactusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuContactusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuContactusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

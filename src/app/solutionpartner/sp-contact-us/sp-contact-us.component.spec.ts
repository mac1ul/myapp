import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpContactUsComponent } from './sp-contact-us.component';

describe('SpContactUsComponent', () => {
  let component: SpContactUsComponent;
  let fixture: ComponentFixture<SpContactUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpContactUsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

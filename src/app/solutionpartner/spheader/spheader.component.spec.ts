import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpheaderComponent } from './spheader.component';

describe('SpheaderComponent', () => {
  let component: SpheaderComponent;
  let fixture: ComponentFixture<SpheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpheaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

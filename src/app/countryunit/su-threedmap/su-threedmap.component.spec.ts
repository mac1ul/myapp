import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuThreedmapComponent } from './su-threedmap.component';

describe('SuThreedmapComponent', () => {
  let component: SuThreedmapComponent;
  let fixture: ComponentFixture<SuThreedmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuThreedmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuThreedmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreedmapComponent } from './threedmap.component';

describe('ThreedmapComponent', () => {
  let component: ThreedmapComponent;
  let fixture: ComponentFixture<ThreedmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreedmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreedmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

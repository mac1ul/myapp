import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreedmapGlobalComponent } from './threedmap-global.component';

describe('ThreedmapGlobalComponent', () => {
  let component: ThreedmapGlobalComponent;
  let fixture: ComponentFixture<ThreedmapGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreedmapGlobalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreedmapGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

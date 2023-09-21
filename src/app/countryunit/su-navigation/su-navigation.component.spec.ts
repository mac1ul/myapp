import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuNavigationComponent } from './su-navigation.component';

describe('SuNavigationComponent', () => {
  let component: SuNavigationComponent;
  let fixture: ComponentFixture<SuNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuNavigationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

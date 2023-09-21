import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListoffasttrackComponent } from './listoffasttrack.component';

describe('ListoffasttrackComponent', () => {
  let component: ListoffasttrackComponent;
  let fixture: ComponentFixture<ListoffasttrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListoffasttrackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListoffasttrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

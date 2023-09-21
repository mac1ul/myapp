import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddprojectlistComponent } from './addprojectlist.component';

describe('AddprojectlistComponent', () => {
  let component: AddprojectlistComponent;
  let fixture: ComponentFixture<AddprojectlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddprojectlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddprojectlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

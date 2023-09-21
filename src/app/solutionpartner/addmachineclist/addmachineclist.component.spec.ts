import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AddmachineclistComponent } from './addmachineclist.component';

describe('AddmachineclistComponent', () => {
  let component: AddmachineclistComponent;
  let fixture: ComponentFixture<AddmachineclistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddmachineclistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddmachineclistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

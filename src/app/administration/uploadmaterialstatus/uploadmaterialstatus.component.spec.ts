import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadmaterialstatusComponent } from './uploadmaterialstatus.component';

describe('UploadmaterialstatusComponent', () => {
  let component: UploadmaterialstatusComponent;
  let fixture: ComponentFixture<UploadmaterialstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadmaterialstatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadmaterialstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

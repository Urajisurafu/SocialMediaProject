import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDataModalComponent } from './change-data-modal.component';

describe('ChangeDataModalComponent', () => {
  let component: ChangeDataModalComponent;
  let fixture: ComponentFixture<ChangeDataModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeDataModalComponent]
    });
    fixture = TestBed.createComponent(ChangeDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

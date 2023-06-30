import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikesWindowComponent } from './likes-window.component';

describe('LikesWindowComponent', () => {
  let component: LikesWindowComponent;
  let fixture: ComponentFixture<LikesWindowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LikesWindowComponent]
    });
    fixture = TestBed.createComponent(LikesWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

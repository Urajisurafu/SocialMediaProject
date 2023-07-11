import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersLikesModalComponent } from './users-likes-modal.component';

describe('UsersLikesModalComponent', () => {
  let component: UsersLikesModalComponent;
  let fixture: ComponentFixture<UsersLikesModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersLikesModalComponent]
    });
    fixture = TestBed.createComponent(UsersLikesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

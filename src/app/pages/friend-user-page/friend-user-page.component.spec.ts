import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendUserPageComponent } from './friend-user-page.component';

describe('FriendUserPageComponent', () => {
  let component: FriendUserPageComponent;
  let fixture: ComponentFixture<FriendUserPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FriendUserPageComponent]
    });
    fixture = TestBed.createComponent(FriendUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

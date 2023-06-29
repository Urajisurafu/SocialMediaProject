import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsInfoWindowComponent } from './friends-info-window.component';

describe('FriendsInfoWindowComponent', () => {
  let component: FriendsInfoWindowComponent;
  let fixture: ComponentFixture<FriendsInfoWindowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FriendsInfoWindowComponent]
    });
    fixture = TestBed.createComponent(FriendsInfoWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

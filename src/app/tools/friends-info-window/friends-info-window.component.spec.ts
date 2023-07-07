import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsInfoWindowComponent } from './friends-info-window.component';
import { MaterialModule } from '../../modules/material/material.module';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { UserDataService } from '../../services/user-data.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FriendsWindowService } from '../../services/friends-window.service';
import { UserData } from '../../interfaces/user-data.interface';
import { UserPageService } from '../../services/user-page.service';
import { NotificationsService } from '../../services/notifications.service';

describe('FriendsInfoWindowComponent', () => {
  let component: FriendsInfoWindowComponent;
  let fixture: ComponentFixture<FriendsInfoWindowComponent>;

  let userDataServiceMock: jasmine.SpyObj<UserDataService>;
  let userPageServiceMock: jasmine.SpyObj<UserPageService>;
  let friendsWindowServiceMock: jasmine.SpyObj<FriendsWindowService>;
  let notificationsServiceMock: jasmine.SpyObj<NotificationsService>;

  const user1: UserData = {
    description: 'description',
    publicName: 'publicName1',
    userId: 'userId1',
    timestamp: new Date(),
  };

  const user2: UserData = {
    description: 'description',
    publicName: 'publicName2',
    userId: 'userId2',
    timestamp: new Date(),
  };

  beforeEach(() => {
    friendsWindowServiceMock = jasmine.createSpyObj('FriendsWindowService', [
      '',
    ]);
    notificationsServiceMock = jasmine.createSpyObj('NotificationsService', [
      'deleteNotificationFriend',
    ]);
    userPageServiceMock = jasmine.createSpyObj('UserPageService', [
      'deleteFriend',
      'deleteUserFriend',
      'addToFriends',
      'goToFriendPage',
    ]);
    userDataServiceMock = jasmine.createSpyObj(
      'UserDataService',
      ['getCurrentUserId'],
      {
        userInfo: {
          publicName: 'Vlad',
          userId: '123',
          timestamp: new Date(),
          description: 'description',
        },
      }
    );
    friendsWindowServiceMock.listOfFriends = [user1, user2];
    friendsWindowServiceMock.listOfNotificationFriends = [user1];

    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: NotificationsService, useValue: notificationsServiceMock },
        { provide: UserDataService, useValue: userDataServiceMock },
        { provide: UserPageService, useValue: userPageServiceMock },
        { provide: FriendsWindowService, useValue: friendsWindowServiceMock },
      ],
      declarations: [FriendsInfoWindowComponent],
    });
    fixture = TestBed.createComponent(FriendsInfoWindowComponent);
    component = fixture.componentInstance;

    component.friendsWindowService = friendsWindowServiceMock;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return 1 when friendsGroup is "newFriends"', () => {
    component.friendsGroup = 'newFriends';
    const result = component.checkIndex();
    expect(result).toEqual(1);
  });

  it('should return 0 when friendsGroup is not "newFriends"', () => {
    component.friendsGroup = 'oldFriends';
    const result = component.checkIndex();
    expect(result).toEqual(0);
  });

  it('should return the list of friends from the FriendsWindowService', () => {
    const expectedList = [user1, user2];

    const result = component.getListOfFriends();

    expect(result).toEqual(expectedList);
  });

  it('should return the list of notification friends from the FriendsWindowService', () => {
    const expectedList = [user1];

    const result = component.getListOfNotificationFriends();

    expect(result).toEqual(expectedList);
  });

  it('should return true when listOfNotificationFriends is truthy and listOfFriends is empty', () => {
    friendsWindowServiceMock.listOfFriends = [];

    const result = component.isNoHaveFriends();

    expect(result).toBe(true);
  });

  it('should return false when listOfFriends is not empty', () => {
    const result = component.isNoHaveFriends();

    expect(result).toBe(false);
  });

  it('should return true when listOfNotificationFriends is truthy and empty', () => {
    friendsWindowServiceMock.listOfNotificationFriends = [];

    const result = component.isNoHaveNotificationFriends();

    expect(result).toBe(true);
  });

  it('should return false when listOfNotificationFriends is not empty', () => {
    const result = component.isNoHaveNotificationFriends();

    expect(result).toBe(false);
  });

  it('should call deleteUserFriend() with the correct friendId', () => {
    const friendId = 'friend-id';

    component.deleteFriendClick(friendId);

    expect(userPageServiceMock.deleteFriend).toHaveBeenCalledWith(friendId);
  });

  it('should delete friend and notification when rejecting friend request', () => {
    const friendId = 'friend1';
    const yourId = 'user1';
    userDataServiceMock.getCurrentUserId.and.returnValue(yourId);

    component.rejectFriendClick(friendId);

    expect(userPageServiceMock.deleteFriend).toHaveBeenCalledWith(friendId);
    expect(
      notificationsServiceMock.deleteNotificationFriend
    ).toHaveBeenCalledWith(yourId, friendId);
  });

  it('should add friend when clicking "Add to Friends"', () => {
    const friendId = 'friend1';

    component.addToFriendsClick(friendId);

    expect(userPageServiceMock.addToFriends).toHaveBeenCalledWith(friendId);
  });

  it('should navigate to friend page when clicking "Go to Friend Page"', () => {
    const creatorId = 'friend1';

    component.goToFriendPageClick(creatorId);

    expect(userPageServiceMock.goToFriendPage).toHaveBeenCalledWith(creatorId);
  });
});

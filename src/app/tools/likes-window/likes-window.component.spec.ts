import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikesWindowComponent } from './likes-window.component';
import { UserDataService } from '../../services/user-data.service';
import { MaterialModule } from '../../modules/material/material.module';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { NotificationsService } from '../../services/notifications.service';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { of } from 'rxjs';
import { PostData } from '../../interfaces/post-data.interface';
import { UserNotificationLikes } from '../../interfaces/user-data.interface';
import { LikesWindowService } from '../../services/likes-window.service';
import { UserPageService } from '../../services/user-page.service';
import { PostWindowComponent } from '../post-window/post-window.component';

describe('LikesWindowComponent', () => {
  let component: LikesWindowComponent;
  let fixture: ComponentFixture<LikesWindowComponent>;

  let userDataServiceMock: jasmine.SpyObj<UserDataService>;
  let dialogMock: jasmine.SpyObj<MatDialog>;
  let notificationsServiceMock: jasmine.SpyObj<NotificationsService>;
  let likesWindowServiceServiceMock: jasmine.SpyObj<LikesWindowService>;
  let matDialogRefMock: jasmine.SpyObj<MatDialogRef<InfoModalComponent>>;
  let userPageServiceMock: jasmine.SpyObj<UserPageService>;

  const post1 = {
    comment: 'comment',
    creatorId: 'creatorId',
    postId: 'postId',
    timestamp: new Date(),
  };

  const userNotificationLikes = [
    {
      creatorId: 'creatorId',
      notificationLikeId: 'notificationLikeId',
      postId: 'postId',
      timestamp: new Date(),
      user: {
        description: 'description',
        publicName: 'publicName',
        userId: 'userId',
        timestamp: new Date(),
      },
      post: post1,
    },
  ];

  const user1: UserNotificationLikes = {
    creatorId: 'creatorId',
    notificationLikeId: 'notificationLikeId1',
    postId: 'postId',
    timestamp: new Date(),
    user: {
      description: 'description',
      publicName: 'publicName',
      userId: 'userId',
      timestamp: new Date(),
    },
    post: post1,
  };

  const user2: UserNotificationLikes = {
    creatorId: 'creatorId',
    notificationLikeId: 'notificationLikeId2',
    postId: 'postId',
    timestamp: new Date(),
    user: {
      description: 'description',
      publicName: 'publicName',
      userId: 'userId',
      timestamp: new Date(),
    },
    post: post1,
  };

  beforeEach(() => {
    dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    userPageServiceMock = jasmine.createSpyObj('UserPageService', [
      'goToFriendPage',
    ]);

    notificationsServiceMock = jasmine.createSpyObj('NotificationsService', [
      'deleteCheckedNotificationLike',
    ]);
    likesWindowServiceServiceMock = jasmine.createSpyObj('LikesWindowService', [
      '',
    ]);
    matDialogRefMock = jasmine.createSpyObj('MatDialogRef', [
      'afterClosed',
      'close',
    ]);

    userDataServiceMock = jasmine.createSpyObj(
      'UserDataService',
      ['resetUserName'],
      {
        userInfo: {
          publicName: 'Vlad',
          userId: '123',
          timestamp: new Date(),
          description: 'description',
        },
      }
    );

    likesWindowServiceServiceMock.listOfNotificationLikes =
      userNotificationLikes;

    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
      ],
      declarations: [LikesWindowComponent],
      providers: [
        { provide: UserDataService, useValue: userDataServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: NotificationsService, useValue: notificationsServiceMock },
        { provide: UserPageService, useValue: userPageServiceMock },
      ],
    });
    fixture = TestBed.createComponent(LikesWindowComponent);
    component = fixture.componentInstance;
    component.likesWindowService = likesWindowServiceServiceMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the info modal dialog and delete selected notifications', () => {
    component.selectedUsers = userNotificationLikes;

    matDialogRefMock.afterClosed.and.returnValue(of(true));
    matDialogRefMock.close.and.returnValue();
    dialogMock.open.and.returnValue(matDialogRefMock);

    component.deleteSelectedLikes();

    expect(dialogMock.open).toHaveBeenCalledWith(InfoModalComponent, {
      data: {
        info: 'Removing notifications',
        message: 'Do you really want to delete the selected notifications?',
        addButton: true,
        nameButton: 'Yes',
      },
    });

    expect(
      notificationsServiceMock.deleteCheckedNotificationLike
    ).toHaveBeenCalledTimes(1);
    expect(
      notificationsServiceMock.deleteCheckedNotificationLike
    ).toHaveBeenCalledWith('notificationLikeId');

    expect(component.selectedUsers).toEqual([]);
  });

  it('should not open the info modal dialog if there are no selected users', () => {
    component.selectedUsers = [];

    component.deleteSelectedLikes();

    expect(dialogMock.open).not.toHaveBeenCalled();

    expect(
      notificationsServiceMock.deleteCheckedNotificationLike
    ).not.toHaveBeenCalled();
  });

  it('should return the list of notification likes', () => {
    const result = component.getNotificationLikesList();

    expect(result).toEqual(userNotificationLikes);
  });

  it('should return true if there are no notification likes', () => {
    likesWindowServiceServiceMock.listOfNotificationLikes = [];

    const result = component.isNoHaveNotificationLikes();

    expect(result).toBe(true);
  });

  it('should return false if there are notification likes', () => {
    likesWindowServiceServiceMock.listOfNotificationLikes =
      userNotificationLikes;

    const result = component.isNoHaveNotificationLikes();

    expect(result).toBe(false);
  });

  it('should call goToFriendPage method of userPageService', () => {
    const creatorId = '123';

    component.goToFriendPageClick(creatorId);

    expect(userPageServiceMock.goToFriendPage).toHaveBeenCalledWith(creatorId);
  });

  it('should add user to selectedUsers list if not already selected', () => {
    component.selectedUsers = [user2];

    component.onCheckboxChange(user1);

    expect(component.selectedUsers).toContain(user1);
  });

  it('should remove user from selectedUsers list if already selected', () => {
    component.selectedUsers = [user2];

    component.onCheckboxChange(user2);

    expect(component.selectedUsers).not.toContain(user2);
  });

  it('should return false if user is not selected', () => {
    component.selectedUsers = [user1, user2];

    const result = component.isChecked(userNotificationLikes[0]);

    expect(result).toBe(false);
  });

  it('should toggle selection of all users', () => {
    const userList: UserNotificationLikes[] = [user2, user1];

    component.selectedUsers = [];
    spyOn(component, 'getNotificationLikesList').and.returnValue(userList);

    component.toggleSelectAll();

    expect(component.selectedUsers).toEqual(userList);

    component.toggleSelectAll();

    expect(component.selectedUsers).toEqual([]);
  });

  it('should open the post window dialog with the correct data', () => {
    const post: PostData = post1;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = post;

    component.showPost(post);

    expect(dialogMock.open).toHaveBeenCalledWith(
      PostWindowComponent,
      dialogConfig
    );
  });
});

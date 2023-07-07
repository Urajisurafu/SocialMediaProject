import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDataModalComponent } from '../change-data-modal/change-data-modal.component';
import { UserDataService } from '../../services/user-data.service';
import { NotificationsService } from '../../services/notifications.service';
import { Router } from '@angular/router';
import { MaterialModule } from '../../modules/material/material.module';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let matDialogMock: jasmine.SpyObj<MatDialog>;
  let userDataServiceMock: jasmine.SpyObj<UserDataService>;
  let notificationsServiceMock: jasmine.SpyObj<NotificationsService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    userDataServiceMock = jasmine.createSpyObj('UserDataService', [
      'getUpdatedUserProfile',
    ]);

    TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      providers: [
        { provide: MatDialog, useValue: matDialogMock },
        { provide: UserDataService, useValue: userDataServiceMock },
        { provide: NotificationsService, useValue: notificationsServiceMock },
        { provide: Router, useValue: routerMock },
      ],
      imports: [MaterialModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create SidebarComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should open ChangeDataModalComponent with correct data for Delete account', () => {
    const expectedData = {
      info: 'Delete account',
      message: `Are you sure you want to delete your account? All your posts will be deleted`,
      yesButton: true,
    };

    component.deleteAccountClick();

    expect(matDialogMock.open).toHaveBeenCalledWith(ChangeDataModalComponent, {
      data: expectedData,
    });
  });

  it('should open ChangeDataModalComponent with correct data for Change description', () => {
    const fakeDescription = 'This is a fake description';
    userDataServiceMock.userInfo = {
      publicName: 'Vlad',
      userId: '123',
      timestamp: new Date(),
      description: fakeDescription,
    };

    component.changeDescriptionClick();

    expect(matDialogMock.open).toHaveBeenCalledWith(ChangeDataModalComponent, {
      data: {
        info: 'Change Description',
        message: `Your current description - ${fakeDescription}`,
        field: 'description',
      },
    });
  });

  it('should open ChangeDataModalComponent with correct data for Change nickname', () => {
    const fakeName = 'Vlad';
    userDataServiceMock.userInfo = {
      publicName: fakeName,
      userId: '123',
      timestamp: new Date(),
      description: 'description',
    };

    component.changeNicknameClick();

    expect(matDialogMock.open).toHaveBeenCalledWith(ChangeDataModalComponent, {
      data: {
        info: 'Change Nickname',
        message: `Your current nickname - ${fakeName}`,
        field: 'publicName',
      },
    });
  });

  it('should navigate to postFeed with postsGroup "allPosts"', () => {
    component.newsClick();

    expect(routerMock.navigate).toHaveBeenCalledWith([
      'postFeed',
      { postsGroup: 'allPosts' },
    ]);
  });

  it('should navigate to postFeed with postsGroup "friendsPosts"', () => {
    component.friendsPostsClick();

    expect(routerMock.navigate).toHaveBeenCalledWith([
      'postFeed',
      { postsGroup: 'friendsPosts' },
    ]);
  });

  it('should navigate to yourFriends with postsGroup "friends"', () => {
    component.friendsClick();

    expect(routerMock.navigate).toHaveBeenCalledWith([
      'yourFriends',
      { friendsGroup: 'friends' },
    ]);
  });

  it('should navigate to yourFriends with postsGroup "newFriends"', () => {
    component.newFriendsClick();

    expect(routerMock.navigate).toHaveBeenCalledWith([
      'yourFriends',
      { friendsGroup: 'newFriends' },
    ]);
  });

  it('should navigate to informationLikes', () => {
    component.newLikesClick();

    expect(routerMock.navigate).toHaveBeenCalledWith(['informationLikes']);
  });

  it('should navigate to userPage', () => {
    component.homaPageClick();

    expect(routerMock.navigate).toHaveBeenCalledWith(['userPage']);
  });
});

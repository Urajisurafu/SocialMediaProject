import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MaterialModule } from '../../modules/material/material.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { PostsDataService } from '../../services/posts-data.service';
import { PostService } from '../../services/post.service';
import { UserDataService } from '../../services/user-data.service';
import { UserPageService } from '../../services/user-page.service';

import { ReplyComponent } from '../reply/reply.component';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { PostComponent } from './post.component';

describe('PostComponent', () => {
  const timestampData = {
    toDate: jasmine.createSpy().and.returnValue(new Date('2023-01-01')),
  };

  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let userDataServiceMock: jasmine.SpyObj<UserDataService>;
  let postsDataServiceMock: jasmine.SpyObj<PostsDataService>;
  let postServiceMock: jasmine.SpyObj<PostService>;
  let userPageServiceMock: jasmine.SpyObj<UserPageService>;
  let matDialogMock: jasmine.SpyObj<MatDialog>;
  let matDialogRefMock: jasmine.SpyObj<MatDialogRef<InfoModalComponent>>;

  beforeEach(() => {
    userDataServiceMock = jasmine.createSpyObj('UserDataService', [
      'getCurrentUserId',
    ]);
    matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    matDialogRefMock = jasmine.createSpyObj('MatDialogRef', [
      'afterClosed',
      'close',
    ]);
    postServiceMock = jasmine.createSpyObj('PostService', [
      'getCreatorInfo',
      'getLikes',
      'likeButton',
      'downloadFile',
      'deletePost',
    ]);
    userPageServiceMock = jasmine.createSpyObj('MainUserPageService', [
      'goToFriendPage',
    ]);

    postServiceMock.creatorImage = 'img';
    postServiceMock.creatorName = 'Vlad';
    postServiceMock.likes = 3;
    postServiceMock.isLiked = true;

    userDataServiceMock.userInfo = {
      publicName: 'Vlad',
      userId: '123',
      timestamp: new Date(),
      description: 'description',
    };

    TestBed.configureTestingModule({
      declarations: [PostComponent],
      imports: [
        MaterialModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
      ],
      providers: [
        { provide: UserDataService, useValue: userDataServiceMock },
        { provide: PostsDataService, useValue: postsDataServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: UserPageService, useValue: userPageServiceMock },
      ],
    });

    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    component.postService = postServiceMock;

    component.postData = {
      comment: 'comment',
      creatorId: '123',
      postId: 'postId',
      timestamp: timestampData,
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the correct date from timestamp', () => {
    const result = component.getDate();

    expect(result).toEqual(new Date('2023-01-01'));
    expect(timestampData.toDate).toHaveBeenCalled();
  });

  it('should open the ReplyComponent dialog', () => {
    component.onReplyClick();

    expect(matDialogMock.open).toHaveBeenCalledWith(ReplyComponent, {
      data: 'postId',
    });
  });

  it('should call likeButton method of postService', () => {
    component.onLikeClick();

    expect(postServiceMock.likeButton).toHaveBeenCalledWith('postId');
  });

  it('should call downloadFile method of postService', () => {
    component.downloadImageClick();

    expect(postServiceMock.downloadFile).toHaveBeenCalledWith(
      'Posts/postId/image'
    );
  });

  it('should return true if creatorId matches userDataService userInfo userId', () => {
    expect(component.checkDeleteButton()).toBe(true);
  });

  it('should open the info modal dialog and delete the post if user confirms', () => {
    matDialogRefMock.afterClosed.and.returnValue(of(true));
    matDialogRefMock.close.and.returnValue();
    matDialogMock.open.and.returnValue(matDialogRefMock);

    component.deletePostClick();

    expect(matDialogMock.open).toHaveBeenCalledWith(InfoModalComponent, {
      data: {
        info: 'Post deletion',
        message: 'Do you really want to remove this post?',
        addButton: true,
        nameButton: 'Yes',
      },
    });

    expect(matDialogRefMock.afterClosed).toHaveBeenCalled();
    expect(postServiceMock.deletePost).toHaveBeenCalledWith('postId');
  });

  it('should call goToFriendPage with the correct creatorId', () => {
    component.goToFriendPageClick();

    expect(userPageServiceMock.goToFriendPage).toHaveBeenCalledWith('123');
  });

  it('should return the user image from PostService', () => {
    const result = component.getUserImage();

    expect(result).toEqual('img');
  });

  it('should return the creator name from PostService', () => {
    const result = component.getCreatorName();

    expect(result).toEqual('Vlad');
  });

  it('should return the likes from PostService', () => {
    const result = component.getLikes();

    expect(result).toEqual(3);
  });

  it('should return the isLikes from PostService', () => {
    const result = component.getIsLiked();

    expect(result).toEqual(true);
  });
});

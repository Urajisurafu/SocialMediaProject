import { ComponentFixture, TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { MaterialModule } from '../../modules/material/material.module';

import { UserDataService } from '../../services/user-data.service';
import { ReplyService } from '../../services/reply.service';

import { ReplyComponent } from './reply.component';

import { CommentData } from '../../interfaces/comment-data.interface';

describe('ReplyComponent', () => {
  let component: ReplyComponent;
  let fixture: ComponentFixture<ReplyComponent>;
  let replyServiceMock: jasmine.SpyObj<ReplyService>;
  const userDataServiceMock = {
    userInfo: {
      publicName: 'Vlad',
      userId: '123',
      timestamp: new Date(),
      description: 'description',
    },
  };

  const expectedComments: CommentData[] = [
    {
      commentId: '1',
      creatorId: '1',
      comment: 'comment',
      timestamp: new Date(),
    },
    {
      commentId: '2',
      creatorId: '2',
      comment: 'comment',
      timestamp: new Date(),
    },
  ];

  const commentValue = 'Test Comment';
  const postId = 'mock-post-id';

  beforeEach(async () => {
    replyServiceMock = jasmine.createSpyObj('ReplyService', [
      'getComments',
      'sendComment',
      'updateComment',
      'deleteComment',
      'isCommentCreator',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        MaterialModule,
      ],
      declarations: [ReplyComponent],
      providers: [
        { provide: UserDataService, useValue: userDataServiceMock },
        { provide: ReplyService, useValue: replyServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: 'mock-post-id' },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplyComponent);
    component = fixture.componentInstance;
    component.replyService = replyServiceMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call sendComment when not changing comment', () => {
    component.isChangeComment = false;
    component.replyForm.get('comment')?.setValue(commentValue);

    component.onSendClick();

    expect(replyServiceMock.sendComment).toHaveBeenCalledWith(
      commentValue,
      postId
    );
    expect(component.isChangeComment).toBe(false);
    expect(component.replyForm.get('comment')?.value).toBe(null);
  });

  it('should call updateComment when comment is valid and isChangeComment is true', () => {
    component.selectedComment = expectedComments[0];
    component.isChangeComment = true;
    component.replyForm.get('comment')?.setValue(commentValue);

    component.onSendClick();

    expect(replyServiceMock.updateComment).toHaveBeenCalledWith(
      expectedComments[0],
      postId,
      commentValue
    );
    expect(component.isChangeComment).toBe(false);
    expect(component.replyForm.get('comment')?.value).toBe(null);
  });

  it('should fetch comments on initialization', () => {
    expect(replyServiceMock.getComments).toHaveBeenCalledTimes(1);
    expect(replyServiceMock.getComments).toHaveBeenCalledWith('mock-post-id');
  });

  it('should return comments from replyService', async () => {
    replyServiceMock.comments = expectedComments;

    const result = component.getPostComments();

    expect(result).toEqual(expectedComments);
    expect(replyServiceMock.getComments).toHaveBeenCalled();
  });

  it('should return true if comment is invalid and touched', () => {
    const commentControl = component.replyForm.get('comment');

    commentControl?.setErrors({ required: true });
    commentControl?.markAsTouched();

    const result = component.checkComment();

    expect(result).toBe(true);
  });

  it('should return false if comment is valid', () => {
    const commentControl = component.replyForm.get('comment');

    commentControl?.setValue('Valid Comment');

    const result = component.checkComment();

    expect(result).toBe(false);
  });

  it('should return true if the comment creator matches the user', () => {
    replyServiceMock.isCommentCreator.and.returnValue(true);

    const comment = expectedComments[0];

    const result = component.isCommentCreator(comment);

    expect(result).toBe(true);
    expect(replyServiceMock.isCommentCreator).toHaveBeenCalledWith(comment);
  });

  it('should return false if the comment creator does not match the user', () => {
    replyServiceMock.isCommentCreator.and.returnValue(false);

    const comment = expectedComments[0];

    const result = component.isCommentCreator(comment);

    expect(result).toBe(false);
    expect(replyServiceMock.isCommentCreator).toHaveBeenCalledWith(comment);
  });

  it('should set isChangeComment to true, set the comment value, focus on the input, and set the selected comment', () => {
    const comment = expectedComments[0];

    component.chaneComment(comment);

    expect(component.isChangeComment).toBe(true);
    expect(component.replyForm.get('comment')?.value).toBe(comment.comment);
  });

  it('should set the comment value with the response format and focus on the input', () => {
    const comment = 'Vlad';

    component.responseComment(comment);

    const expectedValue = `@${comment}_`;
    expect(component.replyForm.get('comment')?.value).toBe(expectedValue);
  });
});

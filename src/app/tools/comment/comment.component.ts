import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { ReplyService } from '../../services/reply.service';
import { UserPageService } from '../../services/user-page.service';

import { CommentData } from '../../interfaces/comment-data.interface';



@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit, OnDestroy {
  @Input() commentData!: CommentData;
  @Input() postId!: string;

  @Output() chaneComment = new EventEmitter<CommentData>();
  @Output() responseComment = new EventEmitter<string>();

  private userInfoSubscription: Subscription | undefined;

  userName: string = '';
  userImageUrl: string = '';
  constructor(
    private replyService: ReplyService,
    private userPageService: UserPageService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.userInfoSubscription = this.replyService
      .getUserInfoById(this.commentData.creatorId)
      .subscribe((data) => {
        this.userName = data?.publicName || '';
        this.userImageUrl = data?.imageUrl || '';
      });
  }

  ngOnDestroy() {
    if (this.userInfoSubscription) {
      this.userInfoSubscription.unsubscribe();
    }
  }

  goToFriendPageClick() {
    this.userPageService.goToFriendPage(this.commentData.creatorId);
    this.dialog.closeAll();
  }

  isCommentCreator() {
    return this.replyService.isCommentCreator(this.commentData);
  }

  chaneCommentClick() {
    this.chaneComment.emit(this.commentData);
  }

  deleteCommentClick() {
    this.replyService.deleteComment(this.commentData, this.postId);
  }

  responseCommentClick() {
    this.responseComment.emit(this.userName);
  }
}

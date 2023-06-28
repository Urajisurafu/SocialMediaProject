import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentData } from '../../interfaces/comment-data.interface';
import { ReplyService } from '../../services/reply.service';
import { UserPageService } from '../../services/user-page.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  @Input() commentData!: CommentData;
  @Input() postId!: string;

  @Output() chaneComment = new EventEmitter<CommentData>();
  @Output() responseComment = new EventEmitter<string>();

  userName: string = '';
  userImageUrl: string = '';
  constructor(
    private replyService: ReplyService,
    private userPageService: UserPageService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.replyService
      .getUserInfoById(this.commentData.creatorId)
      .subscribe((data) => {
        this.userName = data?.publicName || '';
        this.userImageUrl = data?.imageUrl || '';
      });
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

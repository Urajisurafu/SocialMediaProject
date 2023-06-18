import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentData } from '../../interfaces/comment-data.interface';
import { ReplyService } from '../../services/reply.service';

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
  constructor(private replyService: ReplyService) {}

  ngOnInit() {
    this.replyService
      .getUserInfoById(this.commentData.creatorId)
      .subscribe((data) => {
        this.userName = data.publicName;
      });
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

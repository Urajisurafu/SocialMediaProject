import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { UserDataService } from '../../services/user-data.service';
import { ReplyService } from '../../services/reply.service';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CommentData } from '../../interfaces/comment-data.interface';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss'],
  providers: [ReplyService],
})
export class ReplyComponent implements OnInit {
  replyForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) private postId: string,
    private userDataService: UserDataService,
    private replyService: ReplyService
  ) {
    this.replyForm = new FormGroup({
      comment: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.replyService.getComments(this.postId);
  }

  getPostComments() {
    return this.replyService.comments;
  }

  onSendClick() {
    const comment = this.replyForm.get('comment');
    comment?.markAsTouched();
    if (comment && !comment.errors) {
      this.replyService.sendComment(comment.value, this.postId);
      comment.reset();
    }
  }

  checkComment(): boolean {
    return !!(
      this.replyForm.get('comment')?.invalid &&
      this.replyForm.get('comment')?.touched
    );
  }

  isCommentCreator(comment: CommentData) {
    return comment.creatorId === this.userDataService.userInfo.userId;
  }
}

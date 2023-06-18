import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  @ViewChild('commentInput', { static: false }) commentInput!: ElementRef;
  replyForm: FormGroup;
  isChangeComment: boolean = false;
  selectedComment!: CommentData;
  constructor(
    @Inject(MAT_DIALOG_DATA) public postId: string,
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
      if (!this.isChangeComment) {
        this.replyService.sendComment(comment.value, this.postId);
        comment.reset();
      } else {
        this.replyService.updateComment(
          this.selectedComment,
          this.postId,
          comment.value
        );
        this.isChangeComment = false;
        comment.reset();
      }
    }
  }

  checkComment(): boolean {
    return !!(
      this.replyForm.get('comment')?.invalid &&
      this.replyForm.get('comment')?.touched
    );
  }

  isCommentCreator(comment: CommentData) {
    return this.replyService.isCommentCreator(comment);
  }
  chaneComment(comment: CommentData) {
    this.isChangeComment = true;
    this.replyForm.get('comment')?.setValue(comment.comment);
    this.commentInput.nativeElement.focus();

    this.selectedComment = comment;
  }

  responseComment(comment: string) {
    this.replyForm.get('comment')?.setValue(`@${comment}_`);
    this.commentInput.nativeElement.focus();
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { UserDataService } from '../../services/user-data.service';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CommentData } from '../../interfaces/comment-data.interface';

import { PostData } from '../../interfaces/post-data.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss'],
})
export class ReplyComponent implements OnInit {
  private collection: AngularFirestoreCollection<PostData>;
  comments: CommentData[] = [];
  replyForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) private postId: string,
    private firestore: AngularFirestore,
    private userDataService: UserDataService
  ) {
    this.collection = this.firestore.collection<PostData>('Posts');

    this.replyForm = new FormGroup({
      comment: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.getComments();
  }

  getComments() {
    const collectionPath = 'Posts';
    const documentId = this.postId;
    const collectionPath2 = 'PostComments';

    this.listenToDocumentValueChanges(
      collectionPath,
      documentId,
      collectionPath2
    ).subscribe((data) => {
      this.comments = data;
    });
  }

  onSendClick() {
    const comment = this.replyForm.get('comment');
    comment?.markAsTouched();
    if (comment && !comment.errors) {
      this.collection.doc(this.postId).collection('PostComments').add({
        comment: comment.value,
        creatorId: this.userDataService.getCurrentUserId(),
        creatorName: this.userDataService.userName,
        timestamp: new Date(),
      });
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
    return comment.creatorId === this.userDataService.getCurrentUserId();
  }

  listenToDocumentValueChanges(
    collectionPath: string,
    documentId: string,
    collectionPath2: string
  ): Observable<any> {
    const documentRef = this.firestore
      .collection(collectionPath)
      .doc(documentId)
      .collection(collectionPath2, (ref) => ref.orderBy('timestamp', 'desc'));
    return documentRef.valueChanges();
  }
}

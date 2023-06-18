import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { CommentData } from '../interfaces/comment-data.interface';
import { PostData } from '../interfaces/post-data.interface';
import { UserDataService } from './user-data.service';
import { UserData } from '../interfaces/user-data.interface';

@Injectable()
export class ReplyService {
  private collection: AngularFirestoreCollection<PostData>;
  comments: CommentData[] = [];
  constructor(
    private firestore: AngularFirestore,
    private userDataService: UserDataService
  ) {
    this.collection = this.firestore.collection<PostData>('Posts');
  }

  getComments(postId: string) {
    const collectionPath = 'Posts';
    const documentId = postId;
    const collectionPath2 = 'PostComments';

    this.listenToDocumentValueChanges(
      collectionPath,
      documentId,
      collectionPath2
    ).subscribe((data) => {
      const isEqual =
        this.comments.length === data.length &&
        this.comments.every((obj, index) => {
          const otherObj = data[index];
          return obj.comment === otherObj.comment;
        });
      if (!isEqual) this.comments = data;
    });
  }

  listenToDocumentValueChanges(
    collectionPath: string,
    documentId: string,
    collectionPath2: string
  ): Observable<CommentData[]> {
    const documentRef = this.firestore
      .collection(collectionPath)
      .doc(documentId)
      .collection(collectionPath2, (ref) => ref.orderBy('timestamp', 'desc'));
    return documentRef.valueChanges() as Observable<CommentData[]>;
  }

  sendComment(comment: string, postId: string) {
    const commentId = this.firestore.createId();
    this.collection.doc(postId).collection('PostComments').doc(commentId).set({
      commentId: commentId,
      comment: comment,
      creatorId: this.userDataService.userInfo.userId,
      creatorName: this.userDataService.userInfo.publicName,
      timestamp: new Date(),
    });
  }

  updateComment(comment: CommentData, postId: string, textComment: string) {
    this.collection
      .doc(postId)
      .collection('PostComments')
      .doc(comment.commentId)
      .update({
        comment: textComment,
      });
  }

  deleteComment(comment: CommentData, postId: string) {
    this.collection
      .doc(postId)
      .collection('PostComments')
      .doc(comment.commentId)
      .delete();
  }

  isCommentCreator(comment: CommentData) {
    return comment.creatorId === this.userDataService.userInfo.userId;
  }

  getUserInfoById(userId: string): Observable<UserData> {
    return this.firestore
      .collection('Users')
      .doc(userId)
      .valueChanges() as Observable<UserData>;
  }
}

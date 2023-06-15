import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { CommentData } from '../interfaces/comment-data.interface';
import { PostData } from '../interfaces/post-data.interface';
import { UserDataService } from './user-data.service';

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
      this.comments = data;
    });
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

  sendComment(comment: string, postId: string) {
    this.collection.doc(postId).collection('PostComments').add({
      comment: comment,
      creatorId: this.userDataService.userInfo.userId,
      creatorName: this.userDataService.userInfo.publicName,
      timestamp: new Date(),
    });
  }
}
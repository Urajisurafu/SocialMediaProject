import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostData } from '../interfaces/post-data.interface';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { UserDataService } from './user-data.service';

@Injectable()
export class PostsDataService {
  posts: PostData[] = [];
  private collection: AngularFirestoreCollection<PostData>;
  constructor(
    private firestore: AngularFirestore,
    private userDataService: UserDataService
  ) {
    this.collection = this.firestore.collection<PostData>('Posts');
  }

  getSortedCollection(collectionPath: string): Observable<PostData[]> {
    const documentRef = this.firestore.collection<PostData>(
      collectionPath,
      (ref) => ref.orderBy('timestamp', 'desc')
    );
    return documentRef.valueChanges();
  }

  uploadPost(comment: string) {
    const postId = this.firestore.createId();
    return this.collection.doc(postId).set({
      comment: comment,
      creatorId: this.userDataService.getCurrentUserId(),
      timestamp: new Date(),
      postId: postId,
    });
  }

  uploadImagePost(postId: string, comment: string, url: string) {
    return this.collection.doc(postId).set({
      comment: comment,
      creatorId: this.userDataService.getCurrentUserId(),
      imageUrl: url,
      timestamp: new Date(),
      postId: postId,
    });
  }

  getPosts(): void {
    this.getSortedCollection('Posts').subscribe((data) => (this.posts = data));
  }

  deleteUserPosts() {
    this.collection.get().subscribe((querySnapshot) => {
      querySnapshot.forEach((documentSnapshot) => {
        const data = documentSnapshot.data();
        const documentId = documentSnapshot.id;

        if (data && data.creatorId === this.userDataService.userInfo.userId) {
          this.deleteCollection(documentId, 'Likes');
          this.deleteCollection(documentId, 'PostComments');

          this.collection
            .doc(documentId)
            .delete()
            .then(() => {})
            .catch((error) => {
              console.error(
                `Error deleting document with ID ${documentId}`,
                error
              );
            });
        }
      });
    });
  }

  deleteCollection(documentId: string, collection: string) {
    const batch = this.firestore.firestore.batch();

    this.collection
      .doc(documentId)
      .collection(collection)
      .ref.get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });

        return batch.commit();
      });
  }
}

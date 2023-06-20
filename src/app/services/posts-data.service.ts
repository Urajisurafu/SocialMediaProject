import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { UserDataService } from './user-data.service';

import { PostData } from '../interfaces/post-data.interface';

@Injectable()
export class PostsDataService {
  posts: PostData[] = [];
  pageSize = 3;
  lastVisibleDoc: any;
  postsSize!: number;
  currentSize = 0;
  private collection: AngularFirestoreCollection<PostData>;
  constructor(
    private firestore: AngularFirestore,
    private userDataService: UserDataService
  ) {
    this.collection = this.firestore.collection<PostData>('Posts');
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

  getCountOfDocuments() {
    this.collection.ref.get().then((querySnapshot) => {
      this.postsSize = querySnapshot.size;
    });
  }

  getFirstPosts() {
    this.firestore
      .collection('Posts')
      .ref.orderBy('timestamp', 'desc')
      .limit(this.pageSize)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc: any) => {
          this.currentSize++;
          this.posts.push(doc.data());
        });

        this.lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      });
  }

  getScrollPosts() {
    window.onscroll = () => {
      if (
        window.pageYOffset + window.innerHeight >=
          document.documentElement.scrollHeight &&
        this.postsSize > this.posts.length
      ) {
        this.firestore
          .collection('Posts')
          .ref.orderBy('timestamp', 'desc')
          .startAfter(this.lastVisibleDoc)
          .limit(this.pageSize)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc: any) => {
              this.currentSize++;
              this.posts.push(doc.data());
            });

            this.lastVisibleDoc =
              querySnapshot.docs[querySnapshot.docs.length - 1];
          });
      }
    };
  }

  newGetPosts(isAdd?: string) {
    if (isAdd === 'add') this.currentSize++;
    if (isAdd === 'delete') this.currentSize--;

    this.getCountOfDocuments();
    const documentRef = this.firestore.collection<PostData>('Posts', (ref) =>
      ref.orderBy('timestamp', 'desc').limit(this.currentSize)
    );
    documentRef.valueChanges().subscribe((data) => {
      this.posts = data;
    });
  }
}

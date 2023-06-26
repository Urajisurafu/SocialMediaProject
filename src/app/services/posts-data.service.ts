import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { UserDataService } from './user-data.service';
import { UserPageService } from './user-page.service';

import { PostData } from '../interfaces/post-data.interface';

@Injectable()
export class PostsDataService {
  posts: PostData[] = [];
  pageSize = 5;
  lastVisibleDoc: any;
  postsSize!: number;
  currentSize = 0;
  private collection: AngularFirestoreCollection<PostData>;
  constructor(
    private firestore: AngularFirestore,
    private userDataService: UserDataService,
    private mainUserPageService: UserPageService
  ) {
    this.collection = this.firestore.collection<PostData>('Posts');
  }

  uploadPost(comment: string) {
    const postId = this.firestore.createId();
    const creatorId = this.userDataService.getCurrentUserId();
    return this.collection
      .doc(postId)
      .set({
        comment: comment,
        creatorId: creatorId,
        timestamp: new Date(),
        postId: postId,
      })
      .then(() => {
        this.mainUserPageService.addUserPost(creatorId, postId);
      });
  }

  uploadImagePost(postId: string, comment: string, url: string) {
    const creatorId = this.userDataService.getCurrentUserId();
    return this.collection
      .doc(postId)
      .set({
        comment: comment,
        creatorId: this.userDataService.getCurrentUserId(),
        imageUrl: url,
        timestamp: new Date(),
        postId: postId,
      })
      .then(() => {
        this.mainUserPageService.addUserPost(creatorId, postId);
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
    if (this.currentSize === 0) {
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

          this.lastVisibleDoc =
            querySnapshot.docs[querySnapshot.docs.length - 1];
        });
    }
  }

  getScrollPosts() {
    window.onscroll = () => {
      if (
        window.pageYOffset + window.innerHeight >=
          document.documentElement.scrollHeight &&
        this.postsSize > this.currentSize &&
        this.postsSize > this.posts.length &&
        this.currentSize > 0
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

    this.posts = [];

    if (this.currentSize > 0) {
      this.getCountOfDocuments();
      this.firestore
        .collection('Posts')
        .ref.orderBy('timestamp', 'desc')
        .limit(this.currentSize)
        .get()
        .then((querySnapshot) => {
          this.currentSize = 0;
          querySnapshot.forEach((doc: any) => {
            this.currentSize++;
            this.posts.push(doc.data());
          });

          this.lastVisibleDoc =
            querySnapshot.docs[querySnapshot.docs.length - 1];
        });
    } else {
      this.getFirstPosts();
    }

    //#ToDo Implement subscription logic
    // this.firestore
    //   .collection('Posts')
    //   .ref.orderBy('timestamp', 'desc')
    //   .limit(this.currentSize)
    //   .get()
    //   .then((querySnapshot) => {
    //     querySnapshot.forEach(() => {
    //       this.lastVisibleDoc =
    //         querySnapshot.docs[querySnapshot.docs.length - 1];
    //     });
    //   });
    //
    // const documentRef = this.firestore.collection<PostData>('Posts', (ref) =>
    //   ref.orderBy('timestamp', 'desc').limit(this.currentSize)
    // );
    // documentRef.valueChanges().subscribe((data) => {
    //   this.currentSize = data.length;
    //   this.posts = data;
    // });
  }
}

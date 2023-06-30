import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { UserData } from '../interfaces/user-data.interface';
import { LikeInterface, PostData } from '../interfaces/post-data.interface';
import { UserDataService } from './user-data.service';
import { Observable } from 'rxjs';
import { PostsDataService } from './posts-data.service';
import { UserPageService } from './user-page.service';
import { NotificationsService } from './notifications.service';

@Injectable()
export class PostService {
  private collectionUsers: AngularFirestoreCollection<UserData>;
  private collectionPosts: AngularFirestoreCollection<PostData>;

  likes: number = 0;
  isLiked = false;
  yourLikeId: string | null = null;
  creatorPostId: string = '';
  creatorName: string = '';
  creatorDescription: string = '';
  creatorImage: string = '';

  constructor(
    private userDataService: UserDataService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private postDataService: PostsDataService,
    private mainUserPageService: UserPageService,
    private notificationsService: NotificationsService
  ) {
    this.collectionUsers = this.firestore.collection<UserData>('Users');
    this.collectionPosts = this.firestore.collection<PostData>('Posts');
  }

  deletePost(postId: string) {
    const creatorId = this.userDataService.getCurrentUserId();

    this.collectionPosts.doc(postId).delete().then();

    this.mainUserPageService.deleteUserPost(creatorId, postId);

    this.postDataService.deleteCollection(postId, 'Likes');
    this.postDataService.deleteCollection(postId, 'PostComments');

    this.postDataService.newGetPosts('delete');
  }

  getCreatorInfo(postData: PostData) {
    this.collectionUsers
      .doc(postData.creatorId)
      .get()
      .toPromise()
      .then((data) => {
        const userData = data!.data();
        this.creatorName = userData?.publicName || '';
        this.creatorDescription = userData?.description || '';
        this.creatorImage = userData?.imageUrl || '';
        this.creatorPostId = userData?.userId || '';
      })
      .catch((error) => {
        console.error('Error when fetching creator information:', error);
      });
  }

  likeButton(postId: string) {
    if (!this.yourLikeId) {
      this.checkCollectionExistence(postId)
        .then((exists) => {
          if (exists) {
            this.addLike(postId);
          } else {
            this.createLike(postId);
          }
        })
        .catch((error) => {
          console.error('Error checking if collection exists:', error);
        });
    } else {
      this.deleteLike(postId);
    }
  }

  async addLike(postId: string) {
    const creatorId = this.userDataService.getCurrentUserId();
    const likeId = this.firestore.createId();

    try {
      const documents = await this.searchDocumentsByCreatorId(
        creatorId,
        postId
      );
      if (documents.length < 1) {
        await this.collectionPosts
          .doc(postId)
          .collection('Likes')
          .doc(likeId)
          .set({
            likeId,
            creatorId,
            timestamp: new Date(),
          });
        this.notificationsService.addNotificationLike(
          this.creatorPostId,
          creatorId,
          postId
        );
        this.isLiked = true;
      }
    } catch (error) {
      console.error('Error when searching for documents:', error);
    }
  }

  async createLike(postId: string) {
    const likeId = this.firestore.createId();
    const creatorId = this.userDataService.getCurrentUserId();
    try {
      await this.collectionPosts
        .doc(postId)
        .collection('Likes')
        .doc(likeId)
        .set({
          likeId,
          creatorId: creatorId,
          timestamp: new Date(),
        });
      this.notificationsService.addNotificationLike(
        this.creatorPostId,
        creatorId,
        postId
      );
      this.isLiked = true;
    } catch (error) {
      console.error('Error when creating like:', error);
    }
  }

  listenToDocumentValueChanges(
    documentId: string,
    collectionPath2: string
  ): Observable<LikeInterface[]> {
    const documentRef = this.collectionPosts
      .doc(documentId)
      .collection(collectionPath2);
    return documentRef.valueChanges() as Observable<LikeInterface[]>;
  }

  getLikes(postId: string) {
    const documentId = postId;
    const collectionPath2 = 'Likes';
    const creatorId = this.userDataService.getCurrentUserId();

    this.listenToDocumentValueChanges(documentId, collectionPath2).subscribe(
      (data) => {
        this.likes = data.length;

        data.find((like) => {
          if (like.creatorId == creatorId) {
            this.yourLikeId = like.likeId;
            this.isLiked = true;
          }
        });
      }
    );
  }

  deleteLike(postId: string) {
    const yourId = this.userDataService.getCurrentUserId();
    if (this.yourLikeId)
      this.collectionPosts
        .doc(postId)
        .collection('Likes')
        .doc(this.yourLikeId)
        .delete()
        .then(() => {
          this.notificationsService.deleteNotificationLike(
            this.creatorPostId,
            yourId,
            postId
          );
          this.isLiked = false;
          this.yourLikeId = null;
        });
  }

  searchDocumentsByCreatorId(
    creatorId: string,
    postId: string
  ): Promise<LikeInterface[]> {
    const collectionRef = this.collectionPosts
      .doc(postId)
      .collection('Likes').ref;
    return collectionRef
      .where('creatorId', '==', creatorId)
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => doc.data() as LikeInterface);
      })
      .catch((error) => {
        throw error;
      });
  }

  checkCollectionExistence(postId: string): Promise<boolean> {
    const collectionRef = this.collectionPosts.doc(postId).collection('Likes');
    return collectionRef
      .get()
      .toPromise()
      .then((querySnapshot) => !querySnapshot!.empty)
      .catch((error) => {
        throw error;
      });
  }
  downloadFile(filePath: string) {
    const storageRef = this.storage.ref(filePath);

    storageRef
      .getDownloadURL()
      .toPromise()
      .then((url) => {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '');
        link.setAttribute('target', '_blank');

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('Error when downloading file:', error);
      });
  }
}

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

@Injectable()
export class PostService {
  private collectionUsers: AngularFirestoreCollection<UserData>;
  private collectionPosts: AngularFirestoreCollection<PostData>;

  likes: number = 0;
  isLiked = false;
  yourLikeId: string | null = null;
  creatorName: string = '';
  creatorDescription: string = '';

  constructor(
    private userDataService: UserDataService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.collectionUsers = this.firestore.collection<UserData>('Users');
    this.collectionPosts = this.firestore.collection<PostData>('Posts');
  }

  getCreatorInfo(postData: PostData) {
    this.collectionUsers
      .doc(postData.creatorId)
      .get()
      .subscribe((data) => {
        const userData = data.data()!;
        this.creatorName = userData?.publicName || '';
        this.creatorDescription = userData?.description || '';
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

  addLike(postId: string) {
    const creatorId = this.userDataService.getCurrentUserId();
    const likeId = this.firestore.createId();

    this.searchDocumentsByCreatorId(creatorId, postId)
      .then((documents) => {
        if (documents.length < 1) {
          this.collectionPosts
            .doc(postId)
            .collection('Likes')
            .doc(likeId)
            .set({
              likeId: likeId,
              creatorId: this.userDataService.getCurrentUserId(),
              timestamp: new Date(),
            })
            .then(() => (this.isLiked = true));
        }
      })
      .catch((error) => {
        console.error('Error when searching for documents:', error);
      });
  }

  createLike(postId: string) {
    const likeId = this.firestore.createId();
    this.collectionPosts
      .doc(postId)
      .collection('Likes')
      .doc(likeId)
      .set({
        likeId: likeId,
        creatorId: this.userDataService.getCurrentUserId(),
        timestamp: new Date(),
      })
      .then(() => (this.isLiked = true));
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
    if (this.yourLikeId)
      this.collectionPosts
        .doc(postId)
        .collection('Likes')
        .doc(this.yourLikeId)
        .delete()
        .then(() => {
          this.isLiked = false;
          this.yourLikeId = null;
        });
  }

  searchDocumentsByCreatorId(
    creatorId: string,
    postId: string
  ): Promise<LikeInterface[]> {
    return new Promise((resolve, reject) => {
      const collectionRef = this.collectionPosts
        .doc(postId)
        .collection('Likes').ref;
      collectionRef
        .where('creatorId', '==', creatorId)
        .get()
        .then((querySnapshot) => {
          const documents: LikeInterface[] = [];
          querySnapshot.forEach((doc: any) => {
            documents.push(doc.data());
          });
          resolve(documents);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  checkCollectionExistence(postId: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const collectionRef = this.collectionPosts
        .doc(postId)
        .collection('Likes');
      collectionRef.get().subscribe(
        (querySnapshot) => {
          resolve(!querySnapshot.empty);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  downloadFile(filePath: string) {
    const storageRef = this.storage.ref(filePath);

    storageRef.getDownloadURL().subscribe((url) => {
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '');
      link.setAttribute('target', '_blank');

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    });
  }
}

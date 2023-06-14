import { Component, Input, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { ReplyComponent } from '../reply/reply.component';

import { MatDialog } from '@angular/material/dialog';

import { PostData } from '../../interfaces/post-data.interface';
import { UserData } from '../../interfaces/user-data.interface';
import { UserDataService } from '../../services/user-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() postData!: PostData;

  private collectionUsers: AngularFirestoreCollection<UserData>;
  private collectionPosts: AngularFirestoreCollection<PostData>;

  creatorName: string = '';
  creatorDescription: string = '';
  likes: number = 0;
  isLiked: boolean = false;

  yourLikeId: string = '';

  constructor(
    private firestore: AngularFirestore,
    private dialog: MatDialog,
    private userDataService: UserDataService
  ) {
    this.collectionUsers = this.firestore.collection<UserData>('Users');
    this.collectionPosts = this.firestore.collection<PostData>('Posts');
  }

  ngOnInit() {
    this.getCreatorInfo();
    this.getLikes();
  }

  getDate() {
    const timestamp: any = this.postData.timestamp;
    const date: Date = timestamp.toDate();

    return date;
  }

  getCreatorInfo() {
    this.collectionUsers
      .doc(this.postData!.creatorId)
      .get()
      .subscribe((data) => {
        const userData = data.data()!;
        this.creatorName = userData.publicName;
        this.creatorDescription = userData.description;
      });
  }

  onReplyClick() {
    this.dialog.open(ReplyComponent, { data: this.postData.postId });
  }

  onLikeClick() {
    if (!this.yourLikeId) {
      this.checkCollectionExistence()
        .then((exists) => {
          if (exists) {
            this.addLike();
          } else {
            this.createLike();
          }
        })
        .catch((error) => {
          console.error('Ошибка при проверке существования коллекции:', error);
        });
    } else {
      this.deleteLike();
      this.yourLikeId = '';
    }
  }

  listenToDocumentValueChanges(
    documentId: string,
    collectionPath2: string
  ): Observable<any> {
    const documentRef = this.collectionPosts
      .doc(documentId)
      .collection(collectionPath2);
    return documentRef.valueChanges();
  }

  getLikes() {
    const documentId = this.postData.postId;
    const collectionPath2 = 'Likes';
    const creatorId = this.userDataService.getCurrentUserId();

    this.listenToDocumentValueChanges(documentId, collectionPath2).subscribe(
      (data) => {
        this.likes = data.length;

        if (data.find((like: any) => like.creatorId == creatorId)) {
          if (data && data[0].likeId) {
            this.yourLikeId = data[0].likeId;
          }
          this.isLiked = true;
        }
      }
    );
  }

  createLike() {
    const likeId = this.firestore.createId();
    this.collectionPosts
      .doc(this.postData.postId)
      .collection('Likes')
      .doc(likeId)
      .set({
        likeId: likeId,
        creatorId: this.userDataService.getCurrentUserId(),
        timestamp: new Date(),
      })
      .then(() => (this.isLiked = true));
  }

  deleteLike() {
    this.collectionPosts
      .doc(this.postData.postId)
      .collection('Likes')
      .doc(this.yourLikeId)
      .delete()
      .then(() => {
        this.isLiked = false;
      });
  }

  addLike() {
    const creatorId = this.userDataService.getCurrentUserId();
    const likeId = this.firestore.createId();

    this.searchDocumentsByCreatorId(creatorId)
      .then((documents) => {
        if (documents.length < 1) {
          this.collectionPosts
            .doc(this.postData.postId)
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
        console.error('Ошибка при поиске документов:', error);
      });
  }

  searchDocumentsByCreatorId(creatorId: string): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      const collectionRef = this.collectionPosts
        .doc(this.postData.postId)
        .collection('Likes').ref;
      collectionRef
        .where('creatorId', '==', creatorId)
        .get()
        .then((querySnapshot) => {
          const documents: any[] = [];
          querySnapshot.forEach((doc) => {
            documents.push(doc.data());
          });
          resolve(documents);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  checkCollectionExistence(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const collectionRef = this.collectionPosts
        .doc(this.postData.postId)
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
}

import { Injectable } from '@angular/core';
import { forkJoin, map, switchMap, tap } from 'rxjs';
import {
  UserData,
  UserNotificationLikes,
} from '../interfaces/user-data.interface';
import { NotificationsService } from './notifications.service';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { PostData } from '../interfaces/post-data.interface';

@Injectable({ providedIn: 'root' })
export class LikesWindowService {
  private userCollection: AngularFirestoreCollection<UserData>;
  private postCollection: AngularFirestoreCollection<PostData>;

  listOfNotificationLikes!: UserNotificationLikes[];

  constructor(
    private firestore: AngularFirestore,
    private notificationsService: NotificationsService
  ) {
    this.userCollection = this.firestore.collection('Users');
    this.postCollection = this.firestore.collection('Posts');
  }

  resetLikesWindowService() {
    this.listOfNotificationLikes = [] as UserNotificationLikes[];
  }

  getYourNotificationLikes() {
    return this.notificationsService.getYourNotificationLikes().pipe(
      tap((querySnapshot) => {
        if (querySnapshot.length <= 0) {
          this.listOfNotificationLikes = [];
        }
      }),
      switchMap((notificationLikes) => {
        const likeIds = notificationLikes.map((like) => like);
        const requestsUser = likeIds.map((likeId) => {
          return this.userCollection.doc(likeId.creatorId).get();
        });
        return forkJoin(requestsUser).pipe(
          switchMap((resultsUser) => {
            const requestsPost = likeIds.map((likeId) => {
              return this.postCollection.doc(likeId.postId).get();
            });
            return forkJoin(requestsPost).pipe(
              map((resultsPost) => ({
                notificationLikes,
                users: resultsUser.map((snapshot) => snapshot.data()),
                posts: resultsPost.map((snapshot) => snapshot.data()),
              }))
            );
          })
        );
      }),
      tap(({ notificationLikes, users, posts }) => {
        const updatedList = notificationLikes.map((like, index) => {
          const user = users[index];
          const post = posts[index];
          if (user) {
            return {
              ...like,
              post: post,
              user: user,
            };
          }
          return like;
        });

        this.listOfNotificationLikes = updatedList as UserNotificationLikes[];
      })
    );
  }
}

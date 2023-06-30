import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { UserDataService } from './user-data.service';

import { UserData } from '../interfaces/user-data.interface';
import {
  NotificationFriends,
  NotificationLikes,
} from '../interfaces/notification.interface';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private collectionUsers: AngularFirestoreCollection<UserData>;
  constructor(
    private firestore: AngularFirestore,
    private userDataService: UserDataService
  ) {
    this.collectionUsers = this.firestore.collection<UserData>('Users');
  }

  getYourNotificationFriends() {
    const yourId = this.userDataService.getCurrentUserId();
    return this.collectionUsers
      .doc(yourId)
      .collection('NotificationsFriends', (ref) =>
        ref.orderBy('timestamp', 'desc')
      )
      .valueChanges() as Observable<NotificationFriends[]>;
  }

  addNotificationFriend(friendId: string, yourId: string) {
    this.collectionUsers
      .doc(friendId)
      .collection('NotificationsFriends')
      .doc(yourId)
      .set({
        creatorId: yourId,
        timestamp: new Date(),
      })
      .then();
  }

  deleteNotificationFriend(friendId: string, yourId: string) {
    this.collectionUsers
      .doc(friendId)
      .collection('NotificationsFriends')
      .doc(yourId)
      .delete()
      .then();
  }

  getYourNotificationLikes() {
    const yourId = this.userDataService.getCurrentUserId();
    return this.collectionUsers
      .doc(yourId)
      .collection('NotificationsLikes', (ref) =>
        ref.orderBy('timestamp', 'desc')
      )
      .valueChanges() as Observable<NotificationLikes[]>;
  }

  addNotificationLike(friendId: string, yourId: string, postId: string) {
    if (friendId !== yourId) {
      const notificationLike = this.firestore.createId();
      this.collectionUsers
        .doc(friendId)
        .collection('NotificationsLikes')
        .doc(notificationLike)
        .set({
          notificationLikeId: notificationLike,
          postId: postId,
          creatorId: yourId,
          timestamp: new Date(),
        })
        .then();
    }
  }

  deleteCheckedNotificationLike(notificationLike: string) {
    const yourId = this.userDataService.getCurrentUserId();
    this.collectionUsers
      .doc(yourId)
      .collection('NotificationsLikes')
      .doc(notificationLike)
      .delete()
      .then();
  }

  deleteNotificationLike(friendId: string, yourId: string, postId: string) {
    const query = this.collectionUsers
      .doc(friendId)
      .collection('NotificationsLikes')
      .ref.where('creatorId', '==', yourId)
      .where('postId', '==', postId);

    query
      .get()
      .then((querySnapshot) => {
        const deletionPromises = querySnapshot.docs.map((doc) =>
          doc.ref.delete()
        );
        return Promise.all(deletionPromises);
      })
      .catch((error) => {
        console.error('Error deleting documents: ', error);
      });
  }
}

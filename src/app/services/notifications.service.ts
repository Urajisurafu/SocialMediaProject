import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { UserData } from '../interfaces/user-data.interface';
import { NotificationFriends } from '../interfaces/notification-friends.interface';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private collectionUsers: AngularFirestoreCollection<UserData>;
  constructor(private firestore: AngularFirestore) {
    this.collectionUsers = this.firestore.collection<UserData>('Users');
  }

  getYourNotificationFriends(yourId: string) {
    return this.collectionUsers
      .doc(yourId)
      .collection('NotificationsFriends')
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
}

import { Injectable } from '@angular/core';
import { filter, forkJoin, map, Observable, switchMap, tap } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { UserDataService } from './user-data.service';
import { NotificationsService } from './notifications.service';

import { UserData } from '../interfaces/user-data.interface';
import { Friend } from '../interfaces/friends-window.interface';

@Injectable({ providedIn: 'root' })
export class FriendsWindowService {
  listOfFriends!: UserData[];
  listOfNotificationFriends!: UserData[];

  private userCollection: AngularFirestoreCollection<UserData>;

  constructor(
    private firestore: AngularFirestore,
    private userDataService: UserDataService,
    private notificationsService: NotificationsService
  ) {
    this.userCollection = this.firestore.collection('Users');
  }

  getYourCurrentFriends() {
    const userId = this.userDataService.getCurrentUserId();
    return this.userCollection
      .doc(userId)
      .collection('UserFriends', (ref) => ref.where('isFriend', '==', true))
      .valueChanges() as Observable<Friend[]>;
  }

  getYourCurrentFriendsInfo() {
    return this.getYourCurrentFriends().pipe(
      tap((querySnapshot) => {
        if (querySnapshot.length <= 0) {
          this.listOfFriends = [];
        }
      }),
      switchMap((querySnapshot) => {
        const friendIds = querySnapshot.map((friend) => friend.friendId);
        const requests = friendIds.map((friendId) =>
          this.userCollection.doc(friendId).get()
        );
        return forkJoin(requests);
      }),
      map((results) => results.map((snapshot) => snapshot.data())),
      filter((user) => user !== undefined),
      tap((users) => {
        this.listOfFriends = users as UserData[];
      })
    );
  }

  getYourNotificationFriends() {
    return this.notificationsService
      .getYourNotificationFriends(this.userDataService.userInfo.userId)
      .pipe(
        tap((querySnapshot) => {
          if (querySnapshot.length <= 0) {
            this.listOfNotificationFriends = [];
          }
        }),
        switchMap((querySnapshot) => {
          const friendIds = querySnapshot.map((friend) => friend.creatorId);
          const requests = friendIds.map((friendId) =>
            this.userCollection.doc(friendId).get()
          );
          return forkJoin(requests);
        }),
        map((results) => results.map((snapshot) => snapshot.data())),
        filter((user) => user !== undefined),
        tap((users) => {
          this.listOfNotificationFriends = users as UserData[];
        })
      );
  }
}

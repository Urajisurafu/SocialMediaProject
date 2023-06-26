import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { UserData } from '../interfaces/user-data.interface';
import { UserDataService } from './user-data.service';

@Injectable()
export class FriendPageService {
  friendPosts: number = 0;
  friendFriends: number = 0;
  isFriend!: boolean;
  isAwaitingConfirmation!: boolean;

  private collection: AngularFirestoreCollection<UserData>;

  constructor(
    private firestore: AngularFirestore,
    private userDataService: UserDataService
  ) {
    this.collection = this.firestore.collection('Users');
  }

  getUserFriendsExistence(firstId: string, secondId: string) {
    return this.collection
      .doc(firstId)
      .collection('UserFriends')
      .doc(secondId)
      .get();
  }
  getFriendExistence(userId: string) {
    const yourId = this.userDataService.getCurrentUserId();

    const getFriendExistence1$ = this.getUserFriendsExistence(yourId, userId);
    const getFriendExistence2$ = this.getUserFriendsExistence(userId, yourId);

    forkJoin([getFriendExistence1$, getFriendExistence2$]).subscribe(
      ([snapshot1, snapshot2]: any) => {
        this.isAwaitingConfirmation = snapshot1.exists && !snapshot2.exists;

        this.isFriend = snapshot1.exists && snapshot2.exists;
      }
    );
  }

  getFriendById(id: string): Observable<any> {
    return this.collection.doc(id).get();
  }

  getFriendCountOfValuePosts(creatorId: string) {
    this.collection
      .doc(creatorId)
      .collection('UserPosts')
      .valueChanges()
      .subscribe((querySnapshot) => {
        this.friendPosts = querySnapshot.length;
      });
  }

  getFriendCountOfValueFriends(creatorId: string) {
    this.collection
      .doc(creatorId)
      .collection('UserFriends', (ref) => ref.where('isFriend', '==', true))
      .valueChanges()
      .subscribe((querySnapshot) => {
        this.friendFriends = querySnapshot.length;
      });
  }
}

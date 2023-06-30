import { Injectable } from '@angular/core';
import { combineLatest, filter, finalize, switchMap, take, tap } from 'rxjs';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { UserDataService } from './user-data.service';
import { NotificationsService } from './notifications.service';

import { LoaderComponent } from '../tools/loader/loader.component';

import { UserData } from '../interfaces/user-data.interface';

@Injectable({
  providedIn: 'root',
})
export class UserPageService {
  userPosts: number = 0;
  userFriends: number = 0;

  private collectionUsers: AngularFirestoreCollection<UserData>;
  constructor(
    private userDataService: UserDataService,
    private notificationsService: NotificationsService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private dialogOpen: MatDialog,
    private router: Router
  ) {
    this.collectionUsers = this.firestore.collection<UserData>('Users');
  }

  resetUserPageService() {
    this.userPosts = 0;
    this.userFriends = 0;
  }

  addUserPost(userId: string, postId: string) {
    this.collectionUsers
      .doc(userId)
      .collection('UserPosts')
      .doc(postId)
      .set({
        postId: postId,
        creatorId: userId,
        timestamp: new Date(),
      })
      .then();
  }

  deleteUserPost(userId: string, postId: string) {
    this.collectionUsers
      .doc(userId)
      .collection('UserPosts')
      .doc(postId)
      .delete()
      .then();
  }

  uploadUserImage(userId: string, selectedImageFile: File) {
    const filePath = `Users/${userId}/image`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, selectedImageFile);

    const dialogRef = this.dialogOpen.open(LoaderComponent, {
      disableClose: true,
      data: {
        info: 'Upload progress',
        message: '',
      },
    });

    uploadTask
      .percentageChanges()
      .pipe(
        tap((percentage) => {
          dialogRef.componentInstance.message = {
            info: 'Upload progress',
            message: `Upload progress: ${percentage?.toFixed(2)}%`,
          };
        }),
        finalize(() => dialogRef.close()),
        switchMap(() => uploadTask.snapshotChanges()),
        filter((snapshot: any) => snapshot.state === 'success'),
        switchMap(() => fileRef.getDownloadURL()),
        switchMap((url) =>
          this.collectionUsers.doc(userId).update({ imageUrl: url })
        )
      )
      .subscribe(() => {
        this.userDataService.getUpdatedUserProfile();
      });
  }

  getCountOfValuePosts(creatorId: string) {
    this.collectionUsers
      .doc(creatorId)
      .collection('UserPosts')
      .valueChanges()
      .subscribe((querySnapshot) => {
        this.userPosts = querySnapshot.length;
      });
  }

  getCountOfValueFriends(creatorId: string) {
    this.collectionUsers
      .doc(creatorId)
      .collection('UserFriends', (ref) => ref.where('isFriend', '==', true))
      .valueChanges()
      .subscribe((querySnapshot) => {
        this.userFriends = querySnapshot.length;
      });
  }

  addToFriends(friendId: string) {
    const yourId = this.userDataService.getCurrentUserId();
    this.collectionUsers
      .doc(yourId)
      .collection('UserFriends')
      .doc(friendId)
      .set({
        friendId: friendId,
        creatorId: yourId,
        timestamp: new Date(),
        isFriend: false,
      })
      .then(() => {
        this.checkIsFriend(friendId);
      });
  }

  deleteFriend(friendId: string) {
    const yourId = this.userDataService.getCurrentUserId();
    this.deleteUserFriend(yourId, friendId);
    this.deleteUserFriend(friendId, yourId);
  }

  deleteUserFriend(yourId: string, friendId: string) {
    this.collectionUsers
      .doc(yourId)
      .collection('UserFriends')
      .doc(friendId)
      .delete()
      .then(() => this.checkIsFriend(friendId));
  }

  getFriendExistence(firstId: string, secondId: string) {
    return this.collectionUsers
      .doc(firstId)
      .collection('UserFriends')
      .doc(secondId)
      .get();
  }

  checkIsFriend(userId: string) {
    const yourId = this.userDataService.getCurrentUserId();
    const getFriendExistence1$ = this.getFriendExistence(yourId, userId);
    const getFriendExistence2$ = this.getFriendExistence(userId, yourId);

    combineLatest([getFriendExistence1$, getFriendExistence2$])
      .pipe(take(1))
      .subscribe(([snapshot1, snapshot2]: any) => {
        if (snapshot1.exists && !snapshot2.exists) {
          this.notificationsService.addNotificationFriend(userId, yourId);
        }

        if (snapshot1.exists && snapshot2.exists) {
          this.updateFriendsStatus(userId, yourId);
          this.updateFriendsStatus(yourId, userId);
          this.notificationsService.deleteNotificationFriend(userId, yourId);
          this.notificationsService.deleteNotificationFriend(yourId, userId);
        }
      });
  }

  updateFriendsStatus(firstId: string, secondId: string) {
    this.collectionUsers
      .doc(firstId)
      .collection('UserFriends')
      .doc(secondId)
      .update({
        isFriend: true,
      })
      .then();
  }

  goToFriendPage(friendId: string) {
    const yourId = this.userDataService.getCurrentUserId();
    const isCurrentUser = friendId === yourId;
    const route = isCurrentUser ? 'userPage' : 'friendPage';
    const queryParams = isCurrentUser ? undefined : { friendId: friendId };

    this.router.navigate([route], { queryParams });
  }

  deleteSomeCollection(nameCollection: string) {
    const yourId = this.userDataService.getCurrentUserId();
    this.collectionUsers
      .doc(yourId)
      .collection(nameCollection)
      .get()
      .toPromise()
      .then((querySnapshot) => {
        if (querySnapshot) {
          querySnapshot.forEach((doc) => {
            doc.ref.delete();
          });
        }
      });
  }

  deleteUserPostsCollection() {
    this.deleteSomeCollection('UserPosts');
  }

  deleteUserFriendsCollection() {
    this.deleteSomeCollection('UserFriends');
  }
}

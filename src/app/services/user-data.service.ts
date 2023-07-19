import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { UserData } from '../interfaces/user-data.interface';
import { Auth, getAuth } from 'firebase/auth';
import { map } from 'rxjs';

@Injectable()
export class UserDataService {
  private collection: AngularFirestoreCollection<UserData>;
  userHasProfile: boolean = true;
  userInfo!: UserData;
  isLoggedIn: boolean = false;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) {
    this.collection = this.firestore.collection<UserData>('Users');
  }

  resetUserDataService() {
    this.userInfo = {} as UserData;
  }

  getAllUsers() {
    return this.collection.ref.get();
  }

  getUpdatedUserProfile() {
    this.afAuth.currentUser
      .then((user) => {
        const userId = user?.uid;
        return this.firestore
          .collection('Users')
          .doc(userId)
          .get()
          .pipe(
            map((doc) => {
              const userData = doc.data() as UserData;
              this.userHasProfile = doc.exists;
              if (doc.exists) {
                this.userInfo = {
                  userId: userData.userId,
                  publicName: userData.publicName,
                  description: userData.description,
                  timestamp: userData.timestamp,
                  imageUrl: userData.imageUrl,
                };
              }
            })
          )
          .toPromise();
      })
      .catch((error) => {
        console.error('Error getting document:', error);
      });
  }

  checkLoginStatus() {
    this.afAuth.authState.subscribe((user) => {
      this.isLoggedIn = !!user;
      if (user) {
        if (user.emailVerified) {
          this.getUpdatedUserProfile();
          this.router.navigate(['userPage']);
        } else {
          user.sendEmailVerification();
          this.router.navigate(['emailVerification']);
        }
      }
    });
  }

  getCurrentUserId(): string {
    const authInstance: Auth = getAuth();
    const user = authInstance.currentUser;
    return user ? user.uid : '';
  }

  createUser(nickname: string, description: string) {
    this.collection
      .doc(this.getCurrentUserId())
      .set({
        publicName: nickname,
        description: description,
        userId: this.getCurrentUserId(),
        timestamp: new Date(),
      })
      .then(() => {
        this.getUpdatedUserProfile();
        this.router.navigate(['userPage']);
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  }

  resetUserName() {
    this.userInfo.publicName = '';
  }

  deleteUser() {
    this.collection
      .doc(this.userInfo.userId)
      .delete()
      .then(() => {
        this.getUpdatedUserProfile();
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  }

  updateDocumentField(
    collectionPath: string,
    documentId: string,
    field: string,
    value: string
  ): Promise<void> {
    const documentRef = this.firestore
      .collection(collectionPath)
      .doc(documentId);
    const updateData = { [field]: value };

    return documentRef.update(updateData);
  }
}

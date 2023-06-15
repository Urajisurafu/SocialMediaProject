import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

import { UserData } from '../interfaces/user-data.interface';
import { Auth, getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private collection: AngularFirestoreCollection<UserData>;
  userHasProfile: boolean = true;
  userInfo!: UserData;
  isLoggedIn!: boolean;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) {
    this.collection = this.firestore.collection<UserData>('Users');
  }

  updateDocumentField(
    collectionPath: string,
    documentId: string,
    field: string,
    value: any
  ): Promise<void> {
    const documentRef = this.firestore
      .collection(collectionPath)
      .doc(documentId);
    const updateData = { [field]: value };

    return documentRef.update(updateData);
  }

  getCurrentUserId(): string {
    const authInstance: Auth = getAuth();
    const user = authInstance.currentUser;
    return user ? user.uid : '';
  }

  async getUpdatedUserProfile() {
    const user = await this.afAuth.currentUser;

    const documentRef: AngularFirestoreDocument<UserData> = this.firestore
      .collection('Users')
      .doc(user?.uid);
    documentRef.get().subscribe(
      (doc) => {
        this.userHasProfile = doc.exists;
        if (doc.exists) {
          this.router.navigate(['postFeed']);

          this.userInfo = {
            userId: doc.data()!.userId,
            publicName: doc.data()!.publicName,
            description: doc.data()!.description,
          };
        }
      },
      () => {
        console.error('Error getting document');
      }
    );
  }

  checkLoginStatus() {
    this.afAuth.authState.subscribe((user) => {
      this.isLoggedIn = !!user;
      if (user) {
        if (user.emailVerified) {
          this.getUpdatedUserProfile();
        } else {
          user.sendEmailVerification();
          this.router.navigate(['emailVerification']);
        }
      }
    });
  }

  createUser(nickname: string, description: string) {
    this.collection
      .doc(this.getCurrentUserId())
      .set({
        publicName: nickname,
        description: description,
        userId: this.getCurrentUserId(),
      })
      .then(() => {
        this.getUpdatedUserProfile();
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  }
}

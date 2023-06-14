import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

import { UserData } from '../interfaces/user-data.interface';
import { Auth, getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  userHasProfile: boolean = true;
  userName: string = '';
  isLoggedIn!: boolean;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) {}

  getCurrentUserId(): string {
    const authInstance: Auth = getAuth();
    const user = authInstance.currentUser;
    return user ? user.uid : '';
  }

  async getUserProfile() {
    const user = await this.afAuth.currentUser;

    const documentRef: AngularFirestoreDocument<UserData> = this.firestore
      .collection('Users')
      .doc(user?.uid);
    documentRef.get().subscribe(
      (doc) => {
        this.userHasProfile = doc.exists;
        if (doc.exists) {
          this.router.navigate(['postFeed']);
          this.userName = doc.data()!.publicName;
        }
      },
      (error) => {
        console.error('Ошибка при получении документа');
      }
    );
  }

  checkLoginStatus() {
    this.afAuth.authState.subscribe((user) => {
      this.isLoggedIn = !!user;
      if (user) {
        if (user.emailVerified) {
          this.getUserProfile();
        } else {
          user.sendEmailVerification();
          this.router.navigate(['emailVerification']);
        }
      }
    });
  }
}

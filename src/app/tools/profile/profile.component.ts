import { Component, Input } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { UserDataService } from '../../services/user-data.service';

import { UserData } from '../../interfaces/user-data.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  @Input() show!: boolean;

  profileForm: FormGroup;

  private collection: AngularFirestoreCollection<UserData>;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private userDataService: UserDataService
  ) {
    this.collection = this.firestore.collection<UserData>('Users');

    this.profileForm = new FormGroup({
      nickname: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  onContinueClick() {
    const nickname = this.profileForm.get('nickname');
    const description = this.profileForm.get('description');

    nickname?.markAsTouched();
    description?.markAsTouched();

    if (nickname && description && !nickname.errors && !description.errors) {
      this.collection
        .doc(this.userDataService.getCurrentUserId())
        .set({
          publicName: nickname.value,
          description: description.value,
          userId: this.userDataService.getCurrentUserId(),
        })
        .then(() => {
          this.userDataService.getUserProfile();
        })
        .catch((error) => {
          console.error('Error writing document: ', error);
        });
    }
  }
}

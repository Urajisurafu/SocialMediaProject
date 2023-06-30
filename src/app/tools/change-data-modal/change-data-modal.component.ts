import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AngularFireAuth } from '@angular/fire/compat/auth';

import { UserDataService } from '../../services/user-data.service';
import { PostsDataService } from '../../services/posts-data.service';

import { InfoModalComponent } from '../info-modal/info-modal.component';

import { ChangeModal } from '../../interfaces/change-modal.interface';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { UserPageService } from '../../services/user-page.service';

@Component({
  selector: 'app-change-data-modal',
  templateUrl: './change-data-modal.component.html',
  styleUrls: ['./change-data-modal.component.scss'],
})
export class ChangeDataModalComponent {
  sidebarForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public message: ChangeModal,
    private dialogRef: MatDialogRef<ChangeDataModalComponent>,
    private userDataService: UserDataService,
    private postsDataService: PostsDataService,
    private userPageService: UserPageService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.sidebarForm = new FormGroup({
      textData: new FormControl('', [Validators.required]),
    });
  }

  saveData() {
    const newTextData = this.sidebarForm.get('textData');

    if (newTextData && !newTextData.errors)
      this.userDataService
        .updateDocumentField(
          'Users',
          this.userDataService.userInfo.userId,
          this.message.field,
          newTextData.value
        )
        .then(() => {
          this.dialogRef.close();
          this.postsDataService.newGetPosts();
          this.userDataService.getUpdatedUserProfile();
        });
  }

  deleteUser() {
    const user = this.afAuth.currentUser;

    if (!user) return;

    user
      .then((currentUser) => {
        return currentUser;
      })
      .then((user) => {
        return user?.delete();
      })
      .then(() => {
        this.dialogRef.close();
        this.userDataService.deleteUser();
        this.postsDataService.deleteUserPosts();
        this.userPageService.deleteUserPostsCollection();
        this.userPageService.deleteUserFriendsCollection();
        this.userPageService.deleteSomeCollection('NotificationsLikes');
        this.userPageService.deleteSomeCollection('NotificationsFriends');
        this.router.navigate(['']);
      })
      .catch((error) => {
        this.dialog.open(InfoModalComponent, {
          data: {
            info: 'Error deleting account',
            message: error.message,
          },
        });
      });
  }

  closeClick() {
    this.dialogRef.close();
  }
}

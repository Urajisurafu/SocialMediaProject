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
    private afAuth: AngularFireAuth,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.sidebarForm = new FormGroup({
      textData: new FormControl('', [Validators.required]),
    });
  }

  saveClick() {
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
          this.postsDataService.getPosts();
          this.userDataService.getUpdatedUserProfile();
        });
  }

  yesClick() {
    const user = this.afAuth.currentUser;

    if (!user) return;

    user
      .then((currentUser) => {
        if (currentUser) {
          return Promise.resolve(currentUser);
        } else {
          return Promise.reject(new Error('Authentication error'));
        }
      })
      .then((user) => {
        user.delete().then(() => {
          this.dialogRef.close();
          this.userDataService.deleteUser();
          this.postsDataService.deleteUserPosts();
          this.router.navigate(['']);
        });
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

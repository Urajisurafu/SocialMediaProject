import { Component, Inject } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { UserDataService } from '../../services/user-data.service';
import { PostsDataService } from '../../services/posts-data.service';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-change-data-modal',
  templateUrl: './change-data-modal.component.html',
  styleUrls: ['./change-data-modal.component.scss'],
})
export class ChangeDataModalComponent {
  sidebarForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public message: any,
    private dialog: MatDialogRef<ChangeDataModalComponent>,
    private userDataService: UserDataService,
    private postsDataService: PostsDataService
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
          this.dialog.close();
          this.postsDataService.getPosts();
          this.userDataService.getUpdatedUserProfile();
        });
  }
}

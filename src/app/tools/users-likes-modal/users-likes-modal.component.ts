import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { UserPageService } from '../../services/user-page.service';

import { UserData } from '../../interfaces/user-data.interface';

@Component({
  selector: 'app-users-likes-modal',
  templateUrl: './users-likes-modal.component.html',
  styleUrls: ['./users-likes-modal.component.scss'],
})
export class UsersLikesModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public users: { users: UserData[] },
    private userPageService: UserPageService,
    private dialog: MatDialog
  ) {}

  goToFriendPageClick(creatorId: string) {
    this.userPageService.goToFriendPage(creatorId);
    this.dialog.closeAll();
  }
}

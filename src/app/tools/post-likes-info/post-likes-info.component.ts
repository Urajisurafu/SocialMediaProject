import { Component, Input } from '@angular/core';
import { UserData } from '../../interfaces/user-data.interface';

import { UsersLikesModalComponent } from '../users-likes-modal/users-likes-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-post-likes-info',
  templateUrl: './post-likes-info.component.html',
  styleUrls: ['./post-likes-info.component.scss'],
})
export class PostLikesInfoComponent {
  @Input() postId!: string;
  @Input() users: UserData[] = [];

  constructor(private dialog: MatDialog) {}

  openLikesClick() {
    this.dialog.open(UsersLikesModalComponent, {
      data: {
        users: this.users,
      },
    });
  }
}

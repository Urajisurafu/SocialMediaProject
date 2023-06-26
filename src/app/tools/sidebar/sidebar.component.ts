import { Component } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { ChangeDataModalComponent } from '../change-data-modal/change-data-modal.component';
import { UserDataService } from '../../services/user-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  constructor(
    private dialog: MatDialog,
    private userDataService: UserDataService,
    private router: Router
  ) {}

  ChangeNicknameClick() {
    this.dialog.open(ChangeDataModalComponent, {
      data: {
        info: 'Change Nickname',
        message: `Your current nickname - ${this.userDataService.userInfo.publicName}`,
        field: 'publicName',
      },
    });
  }

  ChangeDescriptionClick() {
    this.dialog.open(ChangeDataModalComponent, {
      data: {
        info: 'Change Description',
        message: `Your current description - ${this.userDataService.userInfo.description}`,
        field: 'description',
      },
    });
  }

  DeleteAccountClick() {
    this.dialog.open(ChangeDataModalComponent, {
      data: {
        info: 'Delete account',
        message: `Are you sure you want to delete your account? All your posts will be deleted`,
        yesButton: true,
      },
    });
  }

  HomaPageClick() {
    this.router.navigate(['userPage']);
  }

  NewsClick() {
    this.router.navigate(['postFeed']);
  }
}

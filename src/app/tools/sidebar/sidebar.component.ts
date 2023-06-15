import { Component } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { ChangeDataModalComponent } from '../change-data-modal/change-data-modal.component';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  constructor(
    private dialog: MatDialog,
    private userDataService: UserDataService
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
}

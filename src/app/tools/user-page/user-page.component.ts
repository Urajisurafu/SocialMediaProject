import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserPageService } from '../../services/user-page.service';
import { UserData } from '../../interfaces/user-data.interface';
import { ChangeDataModalComponent } from '../change-data-modal/change-data-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent {
  @Input() userInfo!: UserData;
  @Input() userName: string = '';
  @Input() userDescription: string = '';
  @Input() userTimestamp: any = '';
  @Input() userPostsLength!: number;
  @Input() userFriendsLength!: number;
  @Input() isFriend?: boolean;
  @Input() friendId?: string;
  @Input() isOwnPage!: boolean;
  @Input() getIsAwaitingConfirmation!: boolean;

  @Output() isChangeFriendStatus = new EventEmitter<boolean>();

  infoContent: string = '';
  isInfoWindowVisible: boolean = false;

  constructor(
    private mainUserPageService: UserPageService,
    private userDataService: UserDataService,
    private dialog: MatDialog
  ) {}

  getUserImage() {
    if (this.userInfo && this.userInfo.imageUrl) {
      return this.userInfo.imageUrl;
    } else {
      return '';
    }
  }
  onFileSelected(event: any) {
    const selectedImageFile: File = event.target.files[0];

    this.mainUserPageService.uploadUserImage(
      this.userInfo.userId,
      selectedImageFile
    );
  }

  addToFriends() {
    if (!this.friendId) return;

    this.mainUserPageService.addToFriends(this.friendId);

    this.isChangeFriendStatus.emit(true);
  }

  deleteFriend() {
    if (!this.friendId) return;

    this.mainUserPageService.deleteFriend(this.friendId);

    this.isChangeFriendStatus.emit(true);
  }

  showInfoWindow() {
    this.infoContent =
      'You have already sent a friend invite, wait for the user to accept your invite!';
    this.isInfoWindowVisible = true;
  }

  hideInfoWindow() {
    this.isInfoWindowVisible = false;
  }

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

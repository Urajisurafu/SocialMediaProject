import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { UserPageService } from '../../services/user-page.service';
import { UserDataService } from '../../services/user-data.service';
import { StorageService } from '../../services/storage.service';

import { MatDialog } from '@angular/material/dialog';

import { ChangeDataModalComponent } from '../change-data-modal/change-data-modal.component';

import { UserData } from '../../interfaces/user-data.interface';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit, OnDestroy {
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

  private storageSubscription: Subscription | undefined;

  infoContent: string = '';
  isInfoWindowVisible: boolean = false;
  backgroundStorage: string = '';

  constructor(
    private mainUserPageService: UserPageService,
    private userDataService: UserDataService,
    private dialog: MatDialog,
    @Inject(StorageService) private storageService: StorageService
  ) {}

  ngOnInit() {
    const storagePath = 'Background/home-page.jpg';
    this.storageSubscription = this.storageService
      .getDataFromStorage(storagePath)
      .subscribe((data) => (this.backgroundStorage = `url(${data})`));
  }

  ngOnDestroy() {
    if (this.storageSubscription) {
      this.storageSubscription.unsubscribe();
    }
  }

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

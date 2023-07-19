import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { PostsDataService } from '../../services/posts-data.service';
import { StorageService } from '../../services/storage.service';
import { FriendsWindowService } from '../../services/friends-window.service';
import { UserDataService } from '../../services/user-data.service';

import { CreatePostComponent } from '../../tools/create-post/create-post.component';

import { UserData } from '../../interfaces/user-data.interface';
import { PostData } from '../../interfaces/post-data.interface';

@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.scss'],
})
export class PostFeedComponent implements OnInit, OnDestroy {
  private storageSubscription: Subscription | undefined;
  private postsGroupSubscription: Subscription | undefined;
  private currentFriendsInfoSubscription: Subscription | undefined;

  limit: number = 3;
  backgroundStorage: string = '';
  postsGroup!: string;
  searchPost: string = '';

  listOfFriends: UserData[] = [];
  filteredFriends: UserData[] = [];
  searchTextFriends: string = '';
  friendPosts!: PostData[];

  listOfUsers: UserData[] = [];
  filteredUsers: UserData[] = [];
  searchTextUsers: string = '';
  userPosts!: PostData[];

  constructor(
    @Inject(StorageService) private storageService: StorageService,
    private dialog: MatDialog,
    private postsDataService: PostsDataService,
    private route: ActivatedRoute,
    private friendsWindowService: FriendsWindowService,
    private userDataService: UserDataService
  ) {}

  ngOnInit() {
    const storagePath = 'Background/post-feed2.jpg';
    this.postsGroupSubscription = this.route.paramMap.subscribe((params) => {
      const postsGroup = params.get('postsGroup');
      if (postsGroup) this.postsGroup = postsGroup;
    });
    this.storageSubscription = this.storageService
      .getDataFromStorage(storagePath)
      .subscribe((data: string) => (this.backgroundStorage = `url(${data})`));
    this.delayUntilUserInfo();
    this.postsDataService.getCountOfDocuments();
    this.postsDataService.getFirstPosts();
    this.postsDataService.getScrollPosts();
  }
  ngOnDestroy() {
    if (this.storageSubscription) {
      this.storageSubscription.unsubscribe();
    }
    if (this.postsGroupSubscription) {
      this.postsGroupSubscription.unsubscribe();
    }
    if (this.currentFriendsInfoSubscription) {
      this.currentFriendsInfoSubscription.unsubscribe();
    }
  }

  private async delayUntilUserInfo() {
    if (!this.userDataService.userInfo?.userId) {
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });

      await this.delayUntilUserInfo();
    } else {
      this.currentFriendsInfoSubscription = this.friendsWindowService
        .getYourCurrentFriendsInfo()
        .subscribe((data) => {
          let listOfFriends = data.filter(
            (user): user is UserData => user !== undefined
          );
          listOfFriends.unshift(this.userDataService.userInfo);
          this.filteredFriends = listOfFriends;
          this.listOfFriends = listOfFriends;
        });
      this.postsDataService.getFriendsPosts();

      this.userDataService.getAllUsers().then((querySnapshot) => {
        let users: UserData[] = [];
        querySnapshot.forEach((doc) => {
          users.push(doc.data());
        });
        this.listOfUsers = users;
        this.filteredUsers = users;
      });
    }
  }

  setSelectedFriend(user: UserData) {
    this.searchTextFriends = user.publicName;
    this.postsDataService.getFriendPosts(user.userId).subscribe((posts) => {
      this.friendPosts = posts.filter(
        (user): user is PostData => user !== undefined || true
      );
    });
    this.filterFriends();
  }

  filterFriends() {
    if (this.searchTextFriends === '') {
      this.friendPosts = [];
      this.filteredFriends = this.listOfFriends;
    } else {
      this.filteredFriends = this.listOfFriends.filter((friend) =>
        friend.publicName
          .toLowerCase()
          .includes(this.searchTextFriends.toLowerCase())
      );
    }
  }

  setSelectedUser(user: UserData) {
    this.searchTextUsers = user.publicName;
    this.postsDataService.getFriendPosts(user.userId).subscribe((posts) => {
      this.userPosts = posts.filter(
        (user): user is PostData => user !== undefined || true
      );
    });
    this.filterAllUsers();
  }

  filterAllUsers() {
    if (this.searchTextUsers === '') {
      this.userPosts = [];
      this.filteredUsers = this.listOfUsers;
    } else {
      this.filteredUsers = this.listOfUsers.filter((user) =>
        user.publicName
          .toLowerCase()
          .includes(this.searchTextUsers.toLowerCase())
      );
    }
  }

  getPosts() {
    let posts;

    if (this.userPosts?.length > 0) {
      posts = this.userPosts;
    } else {
      posts = this.postsDataService.posts;
    }

    if (this.searchPost) {
      const lowerCaseSearchTerm = this.searchPost.toLowerCase();

      posts = posts.filter((post) =>
        post.comment.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    return posts;
  }

  getPostsFriends() {
    let posts;

    if (this.friendPosts?.length > 0) {
      posts = this.friendPosts;
    } else {
      posts = this.postsDataService.sortedPostsFriends;
    }

    if (this.searchPost) {
      const lowerCaseSearchTerm = this.searchPost.toLowerCase();

      posts = posts.filter((post) =>
        post.comment.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    return posts;
  }

  onCreatePostClick() {
    this.dialog.open(CreatePostComponent);
  }
}

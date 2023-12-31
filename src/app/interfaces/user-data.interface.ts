import { PostData } from './post-data.interface';

export interface UserData {
  description: string;
  publicName: string;
  userId: string;
  timestamp: any;
  imageUrl?: string;
}

export interface UserNotificationLikes {
  creatorId: string;
  notificationLikeId: string;
  postId: string;
  timestamp: any;
  user: UserData;
  post: PostData;
}

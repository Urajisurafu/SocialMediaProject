export interface PostData {
  comment: string;
  creatorId: string;
  imageUrl?: string;
  postId: string;
  timestamp: any;
}

export interface LikeInterface {
  creatorId: string;
  likeId: string;
  timestamp: Date;
}

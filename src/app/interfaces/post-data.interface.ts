export interface PostData {
  comment: string;
  creatorId: string;
  imageUrl?: string;
  postId: string;
  timestamp: string | Date;
}

export interface LikeInterface {
  creatorId: string;
  likeId: string;
  timestamp: Date;
}

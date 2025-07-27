import { Timestamp } from "@angular/fire/firestore";

export interface Article {
  authorId: string;
  authorName: string;
  category: string;
  content: string;
  likes: number;
  likedBy: string[];
  preview: string;
  thumbnailUrl: string;
  title: string;
  createdAt: Timestamp;
  id?: string;
}

export interface ArticleUpdate {
  category: string;
  content: string;
  preview: string;
  thumbnailUrl: string;
  title: string;
}

import { FirestoreArray, FirestoreString } from "./firestore-values";

export interface Article {
  authorId: FirestoreString;
  authorName: FirestoreString;
  category: FirestoreString;
  content: FirestoreString;
  likes: FirestoreArray;
  preview: FirestoreString;
  thumbnailUrl: FirestoreString;
  title: FirestoreString;
}

import { Article } from "./article";

export interface FirestoreDocument {
  name: string;
  fields: Article;
  createTime: string;
  updateTime: string;
}

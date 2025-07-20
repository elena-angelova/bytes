import { Injectable } from "@angular/core";
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  DocumentReference,
  Firestore,
  query,
  where,
} from "@angular/fire/firestore";
import { Article } from "../types";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ArticlesService {
  constructor(private firestore: Firestore) {}

  // !Check if getArticles() and getArticlesByCategory() methods work correctly and actually get the information you want

  // getArticles(): Observable<Article[]> {
  //   const articlesRef = collection(
  //     this.firestore,
  //     "articles"
  //   ) as CollectionReference<Article>;

  //   return collectionData(articlesRef);
  // }

  // getArticlesByCategory(category: string): Observable<Article[]> {
  //   const articlesRef = collection(
  //     this.firestore,
  //     "articles"
  //   ) as CollectionReference<Article>;
  //   const categoryQuery = query(articlesRef, where("category", "==", category));

  //   return collectionData(categoryQuery);
  // }

  // !

  async createArticle(data: Article): Promise<DocumentReference> {
    const articlesRef = collection(this.firestore, "articles");

    return addDoc(articlesRef, data);
  }
}

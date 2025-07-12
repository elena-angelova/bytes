import { Injectable } from "@angular/core";
import {
  collectionData,
  CollectionReference,
  Firestore,
  query,
  where,
} from "@angular/fire/firestore";
import { Article } from "../types";
import { collection } from "firebase/firestore";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ArticlesService {
  constructor(private firestore: Firestore) {}

  getArticles(): Observable<Article[]> {
    const articlesRef = collection(
      this.firestore,
      "articles"
    ) as CollectionReference<Article>;

    return collectionData(articlesRef);
  }

  getArticlesByCategory(category: string): Observable<Article[]> {
    const articlesRef = collection(
      this.firestore,
      "articles"
    ) as CollectionReference<Article>;
    const categoryQuery = query(articlesRef, where("category", "==", category));

    return collectionData(categoryQuery);
  }
}

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
import { orderBy } from "firebase/firestore";

@Injectable({
  providedIn: "root",
})
export class ArticlesService {
  constructor(private firestore: Firestore) {}

  // !Check if getArticles() and getArticlesByCategory() methods are causing listening channel issues

  getArticles(): Observable<Article[]> {
    const articlesRef = collection(
      this.firestore,
      "articles"
    ) as CollectionReference<Article>;
    const articlesQuery = query(articlesRef, orderBy("createdAt", "desc"));

    return collectionData(articlesQuery, { idField: "id" });
  }

  getArticlesByCategory(category: string): Observable<Article[]> {
    const articlesRef = collection(
      this.firestore,
      "articles"
    ) as CollectionReference<Article>;
    const categoryQuery = query(
      articlesRef,
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );

    return collectionData(categoryQuery, { idField: "id" });
  }

  getArticlesByAuthor(authorId: string): Observable<Article[]> {
    const articlesRef = collection(
      this.firestore,
      "articles"
    ) as CollectionReference<Article>;
    const authorQuery = query(
      articlesRef,
      where("authorId", "==", authorId),
      orderBy("createdAt", "desc")
    );

    return collectionData(authorQuery, { idField: "id" });
  }

  async createArticle(data: Article): Promise<DocumentReference> {
    const articlesRef = collection(this.firestore, "articles");

    return addDoc(articlesRef, data);
  }
}

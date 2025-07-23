import { Injectable } from "@angular/core";
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  doc,
  docData,
  DocumentReference,
  Firestore,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "@angular/fire/firestore";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Article } from "../types";
import { from, map, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ArticlesService {
  private readonly pageSize = 9;
  private lastDoc: QueryDocumentSnapshot<DocumentData> | null = null;

  constructor(private firestore: Firestore) {}

  getArticles(): Observable<Article[]> {
    const articlesRef = collection(
      this.firestore,
      "articles"
    ) as CollectionReference<Article>;

    let articlesQuery = query(
      articlesRef,
      orderBy("createdAt", "desc"),
      limit(this.pageSize)
    );

    if (this.lastDoc) {
      articlesQuery = query(
        articlesRef,
        orderBy("createdAt", "desc"),
        startAfter(this.lastDoc),
        limit(this.pageSize)
      );
    }

    return from(getDocs(articlesQuery)).pipe(
      map((querySnapshot) => {
        const articles = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Article),
        }));

        if (querySnapshot.docs.length > 0) {
          this.lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        }

        return articles;
      })
    );
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

  getSingleArticle(articleId: string): Observable<Article | undefined> {
    const articleDocRef = doc(this.firestore, "articles", articleId);

    return docData(articleDocRef) as Observable<Article | undefined>;
  }

  async createArticle(data: Article): Promise<DocumentReference> {
    const articlesRef = collection(this.firestore, "articles");

    return addDoc(articlesRef, data);
  }

  resetPagination() {
    this.lastDoc = null;
  }
}

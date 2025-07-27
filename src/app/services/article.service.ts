import { Injectable } from "@angular/core";
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  DocumentReference,
  Firestore,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "@angular/fire/firestore";
import {
  arrayRemove,
  arrayUnion,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { Article, ArticleUpdate } from "../types";
import { from, map, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ArticleService {
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

  createArticle(data: Article): Promise<DocumentReference> {
    const articlesRef = collection(this.firestore, "articles");

    return addDoc(articlesRef, data);
  }

  likeArticle(articleId: string, userId: string): Promise<void> {
    const articleDocRef = doc(this.firestore, "articles", articleId);

    return updateDoc(articleDocRef, {
      likes: increment(1),
      likedBy: arrayUnion(userId),
    });
  }

  unlikeArticle(articleId: string, userId: string): Promise<void> {
    const articleDocRef = doc(this.firestore, "articles", articleId);

    return updateDoc(articleDocRef, {
      likes: increment(-1),
      likedBy: arrayRemove(userId),
    });
  }

  editArticle(data: ArticleUpdate, articleId: string): Promise<void> {
    const articleDocRef = doc(this.firestore, "articles", articleId);

    return updateDoc(articleDocRef, {
      ...data,
    });
  }

  deleteArticle(articleId: string): Promise<void> {
    const articleDocRef = doc(this.firestore, "articles", articleId);

    return deleteDoc(articleDocRef);
  }

  resetPagination(): void {
    this.lastDoc = null;
  }
}

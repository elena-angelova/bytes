import { Injectable } from "@angular/core";
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  documentId,
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
  Query,
  QueryDocumentSnapshot,
  WhereFilterOp,
} from "firebase/firestore";
import { Article } from "../types";
import { forkJoin, from, map, Observable } from "rxjs";

type FirestoreFilter =
  | []
  | [field: string, operator: WhereFilterOp, value: string];

@Injectable({
  providedIn: "root",
})
export class ArticleService {
  private lastDoc: QueryDocumentSnapshot<DocumentData> | null = null;

  constructor(private firestore: Firestore) {}

  private get articlesRef(): CollectionReference<Article> {
    return collection(
      this.firestore,
      "articles"
    ) as CollectionReference<Article>;
  }

  private getArticleDocRef(articleId: string): DocumentReference<Article> {
    return doc(
      this.firestore,
      "articles",
      articleId
    ) as DocumentReference<Article>;
  }

  private fetchArticles(
    filters: FirestoreFilter,
    pageSize: number
  ): Observable<Article[]> {
    let baseQuery: Query<Article> = this.articlesRef;

    if (filters.length === 3) {
      const [field, operator, value] = filters;
      baseQuery = query(this.articlesRef, where(field, operator, value));
    }

    baseQuery = query(baseQuery, orderBy("createdAt", "desc"));

    if (this.lastDoc) {
      baseQuery = query(baseQuery, startAfter(this.lastDoc));
    }

    baseQuery = query(baseQuery, limit(pageSize));

    return from(getDocs(baseQuery)).pipe(
      map((snapshot) => {
        const docs = snapshot.docs;

        if (docs.length > 0) {
          this.lastDoc = docs[docs.length - 1];
        }

        return docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Article[];
      })
    );
  }

  getArticles(pageSize: number): Observable<Article[]> {
    return this.fetchArticles([], pageSize);
  }

  getArticlesByCategory(
    category: string,
    pageSize: number
  ): Observable<Article[]> {
    return this.fetchArticles(["category", "==", category], pageSize);
  }

  getArticlesByAuthor(
    authorId: string,
    pageSize: number
  ): Observable<Article[]> {
    return this.fetchArticles(["authorId", "==", authorId], pageSize);
  }

  getReadingListArticles(articleIds: string[]): Observable<Article[]> {
    const readingListQuery = query(
      this.articlesRef,
      where(documentId(), "in", articleIds)
    );

    return from(getDocs(readingListQuery)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Article))
      )
    );
  }

  getOwnArticles(uid: string): Observable<Article[]> {
    const authorQuery = query(
      this.articlesRef,
      where("authorId", "==", uid),
      orderBy("createdAt", "desc")
    );

    return collectionData(authorQuery, { idField: "id" });
  }

  searchArticles(q: string): Observable<Article[]> {
    const queryTitle = query(
      this.articlesRef,
      where("title", ">=", q),
      where("title", "<=", q + "\uf8ff")
    );

    const queryCategory = query(
      this.articlesRef,
      where("category", ">=", q),
      where("category", "<=", q + "\uf8ff")
    );

    const title$ = from(getDocs(queryTitle));
    const category$ = from(getDocs(queryCategory));

    return forkJoin({
      titleMatches: title$,
      categoryMatches: category$,
    }).pipe(
      map(({ titleMatches, categoryMatches }) => {
        const titleResults = titleMatches.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const categoryResults = categoryMatches.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const mergedMap = new Map<string, Article>();

        titleResults.forEach((item) => mergedMap.set(item.id, item));
        categoryResults.forEach((item) => mergedMap.set(item.id, item));

        return Array.from(mergedMap.values());
      })
    );
  }

  getSingleArticle(articleId: string): Observable<Article | undefined> {
    const articleDocRef = this.getArticleDocRef(articleId);
    return docData(articleDocRef) as Observable<Article | undefined>;
  }

  createArticle(data: Article): Promise<DocumentReference> {
    return addDoc(this.articlesRef, data);
  }

  likeArticle(articleId: string, userId: string): Promise<void> {
    const articleDocRef = this.getArticleDocRef(articleId);
    return updateDoc(articleDocRef, {
      likes: increment(1),
      likedBy: arrayUnion(userId),
    });
  }

  unlikeArticle(articleId: string, userId: string): Promise<void> {
    const articleDocRef = this.getArticleDocRef(articleId);
    return updateDoc(articleDocRef, {
      likes: increment(-1),
      likedBy: arrayRemove(userId),
    });
  }

  editArticle(data: Partial<Article>, articleId: string): Promise<void> {
    const articleDocRef = this.getArticleDocRef(articleId);
    return updateDoc(articleDocRef, {
      ...data,
    });
  }

  deleteArticle(articleId: string): Promise<void> {
    const articleDocRef = this.getArticleDocRef(articleId);
    return deleteDoc(articleDocRef);
  }

  resetPagination(): void {
    this.lastDoc = null;
  }
}

// export class ArticleService {
//   private lastDoc: QueryDocumentSnapshot<DocumentData> | null = null;

//   constructor(private firestore: Firestore) {}

//   getArticles(pageSize: number): Observable<Article[]> {
//     const articlesRef = collection(
//       this.firestore,
//       "articles"
//     ) as CollectionReference<Article>;

//     let articlesQuery = query(
//       articlesRef,
//       orderBy("createdAt", "desc"),
//       limit(pageSize)
//     );

//     if (this.lastDoc) {
//       articlesQuery = query(
//         articlesRef,
//         orderBy("createdAt", "desc"),
//         startAfter(this.lastDoc),
//         limit(pageSize)
//       );
//     }

//     return from(getDocs(articlesQuery)).pipe(
//       map((snapshot) => {
//         const docs = snapshot.docs;

//         if (docs.length > 0) {
//           this.lastDoc = docs[docs.length - 1];
//         }

//         const articles = docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         })) as Article[];

//         return articles;
//       })
//     );
//   }

//   getArticlesByCategory(
//     category: string,
//     pageSize: number
//   ): Observable<Article[]> {
//     const articlesRef = collection(
//       this.firestore,
//       "articles"
//     ) as CollectionReference<Article>;

//     let categoryQuery = query(
//       articlesRef,
//       where("category", "==", category),
//       orderBy("createdAt", "desc"),
//       limit(pageSize)
//     );

//     if (this.lastDoc) {
//       categoryQuery = query(
//         articlesRef,
//         where("category", "==", category),
//         orderBy("createdAt", "desc"),
//         startAfter(this.lastDoc),
//         limit(pageSize)
//       );
//     }

//     return from(getDocs(categoryQuery)).pipe(
//       map((snapshot) => {
//         const docs = snapshot.docs;

//         if (docs.length > 0) {
//           this.lastDoc = docs[docs.length - 1];
//         }

//         const articles = docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         })) as Article[];

//         return articles;
//       })
//     );
//   }

//   getArticlesByAuthor(
//     authorId: string,
//     pageSize: number
//   ): Observable<Article[]> {
//     const articlesRef = collection(
//       this.firestore,
//       "articles"
//     ) as CollectionReference<Article>;

//     let authorQuery = query(
//       articlesRef,
//       where("authorId", "==", authorId),
//       orderBy("createdAt", "desc"),
//       limit(pageSize)
//     );

//     if (this.lastDoc) {
//       authorQuery = query(
//         articlesRef,
//         where("authorId", "==", authorId),
//         orderBy("createdAt", "desc"),
//         startAfter(this.lastDoc),
//         limit(pageSize)
//       );
//     }

//     return from(getDocs(authorQuery)).pipe(
//       map((snapshot) => {
//         const docs = snapshot.docs;

//         if (docs.length > 0) {
//           this.lastDoc = docs[docs.length - 1];
//         }

//         const articles = docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         })) as Article[];

//         return articles;
//       })
//     );
//   }

//   getOwnArticles(uid: string) {
//     const articlesRef = collection(
//       this.firestore,
//       "articles"
//     ) as CollectionReference<Article>;

//     const authorQuery = query(
//       articlesRef,
//       where("authorId", "==", uid),
//       orderBy("createdAt", "desc")
//     );

//     return collectionData(authorQuery, { idField: "id" });
//   }

//   getReadingListArticles(articleIds: string[]): Observable<Article[]> {
//     const articlesRef = collection(
//       this.firestore,
//       "articles"
//     ) as CollectionReference<Article>;

//     const readingListQuery = query(
//       articlesRef,
//       where(documentId(), "in", articleIds)
//     );

//     return collectionData(readingListQuery, { idField: "id" });
//   }

//   getSingleArticle(articleId: string): Observable<Article | undefined> {
//     const articleDocRef = doc(this.firestore, "articles", articleId);

//     return docData(articleDocRef) as Observable<Article | undefined>;
//   }

//   createArticle(data: Article): Promise<DocumentReference> {
//     const articlesRef = collection(this.firestore, "articles");

//     return addDoc(articlesRef, data);
//   }

//   likeArticle(articleId: string, userId: string): Promise<void> {
//     const articleDocRef = doc(this.firestore, "articles", articleId);

//     return updateDoc(articleDocRef, {
//       likes: increment(1),
//       likedBy: arrayUnion(userId),
//     });
//   }

//   unlikeArticle(articleId: string, userId: string): Promise<void> {
//     const articleDocRef = doc(this.firestore, "articles", articleId);

//     return updateDoc(articleDocRef, {
//       likes: increment(-1),
//       likedBy: arrayRemove(userId),
//     });
//   }

//   editArticle(data: Partial<Article>, articleId: string): Promise<void> {
//     const articleDocRef = doc(this.firestore, "articles", articleId);

//     return updateDoc(articleDocRef, {
//       ...data,
//     });
//   }

//   deleteArticle(articleId: string): Promise<void> {
//     const articleDocRef = doc(this.firestore, "articles", articleId);

//     return deleteDoc(articleDocRef);
//   }

//   resetPagination(): void {
//     this.lastDoc = null;
//   }
// }

//* -----
// getArticles(
//   pageSize: number,
//   onChanges: (articles: Article[]) => void,
//   onError: (error: any) => void
// ): () => void {
//   const articlesRef = collection(
//     this.firestore,
//     "articles"
//   ) as CollectionReference<Article>;

//   let articlesQuery = query(
//     articlesRef,
//     orderBy("createdAt", "desc"),
//     limit(pageSize)
//   );

//   if (this.lastDoc) {
//     articlesQuery = query(
//       articlesRef,
//       orderBy("createdAt", "desc"),
//       startAfter(this.lastDoc),
//       limit(pageSize)
//     );
//   }

//   const unsubscribe: Unsubscribe = onSnapshot(
//     articlesQuery,
//     (snapshot) => {
//       const docs = snapshot.docs;

//       if (docs.length > 0) {
//         this.lastDoc = docs[docs.length - 1];
//       }

//       const articles = docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Article[];

//       onChanges(articles);
//     },
//     (error) => {
//       onError(error);
//     }
//   );

//   return unsubscribe;
// }

// getArticlesByAuthor(
//   authorId: string
// ): Observable<Article[]> {
//   const articlesRef = collection(
//     this.firestore,
//     "articles"
//   ) as CollectionReference<Article>;

//   const authorQuery = query(
//     articlesRef,
//     where("authorId", "==", authorId),
//     orderBy("createdAt", "desc")
//   );

//   return collectionData(authorQuery, { idField: "id" });
// }

// getArticlesByCategory(category: string): Observable<Article[]> {
//   const articlesRef = collection(
//     this.firestore,
//     "articles"
//   ) as CollectionReference<Article>;
//   const categoryQuery = query(
//     articlesRef,
//     where("category", "==", category),
//     orderBy("createdAt", "desc")
//   );

//   return collectionData(categoryQuery, { idField: "id" });
// }
//* -----

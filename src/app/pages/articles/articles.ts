import { Component, OnDestroy, OnInit } from "@angular/core";
import { Article } from "../../types";
import { ArticleService } from "../../services/article.service";
import { Router } from "@angular/router";
import { ArticleCategoryFilterComponent } from "../../features/article/article-category-filter/article-category-filter";
import { ArticleGridComponent } from "../../features/article/article-grid/article-grid";
import { LoaderComponent } from "../../shared/loader/loader";
import { EmptyStateComponent } from "../../shared/empty-state/empty-state";
import { ErrorService } from "../../services/error.service";
import { firebaseErrorMessages } from "../../config";
import { ToastNotificationComponent } from "../../shared/toast-notification/toast-notification";
import { CtaButtonComponent } from "../../shared/buttons/cta-button/cta-button";
import { finalize, Subscription } from "rxjs";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-articles",
  imports: [
    ArticleCategoryFilterComponent,
    ArticleGridComponent,
    CtaButtonComponent,
    LoaderComponent,
    EmptyStateComponent,
    ToastNotificationComponent,
  ],
  templateUrl: "./articles.html",
  styleUrl: "./articles.css",
})
export class ArticlesComponent implements OnInit, OnDestroy {
  articles: Article[] = [];

  isLoggedIn: boolean = false;
  isMenuOpened: boolean = false;
  isLoading: boolean = true;
  isLoadingMore: boolean = false;
  hasMore: boolean = true;

  hasError: boolean = false;
  serverErrorMessage: string = "";
  private readonly pageSize = 9;

  private currentUserSub?: Subscription;
  private articlesSub?: Subscription;

  constructor(
    private authService: AuthService,
    private articleService: ArticleService,
    private errorService: ErrorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUserSub = this.authService.currentUser$.subscribe(
      (currentUser) => (this.isLoggedIn = !!currentUser)
    );

    this.articleService.resetPagination();
    this.loadArticles();
  }

  loadMore() {
    if (!this.hasMore || this.isLoadingMore) return;

    this.isLoadingMore = true;
    this.loadArticles();
  }

  loadArticles(): void {
    this.articlesSub = this.articleService
      .getArticles(this.pageSize)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.isLoadingMore = false;
        })
      )
      .subscribe({
        next: (articles) => {
          this.hasMore = articles.length === this.pageSize;

          if (articles.length === 0) return;

          this.articles = [...this.articles, ...articles];
        },
        error: (error: any) => {
          this.errorService.handleError(
            this,
            error.code,
            firebaseErrorMessages
          );
        },
      });
  }

  onFilter(category: string): void {
    this.router.navigate(["/articles/category", category]);
  }

  openAuthorProfile(authorId: string): void {
    this.router.navigate(["/users", authorId]);
  }

  toggleMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;
  }

  ngOnDestroy(): void {
    this.currentUserSub?.unsubscribe();
    this.articlesSub?.unsubscribe();
  }
}

//*------
// export class ArticlesComponent implements OnInit, OnDestroy {
//   articles: Article[] = [];

//   isMenuOpened: boolean = false;
//   isLoading: boolean = true;
//   isLoadingMore: boolean = false;
//   hasMore: boolean = true;

//   hasError: boolean = false;
//   serverErrorMessage: string = "";

//   private readonly pageSize = 9;
//   private unsubscribers: Unsubscribe[] = [];

//   constructor(
//     private articleService: ArticleService,
//     private errorService: ErrorService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.articleService.resetPagination();

//     const unsubscribe = this.articleService.getArticles(
//       this.pageSize,
//       this.onChanges.bind(this),
//       this.onError.bind(this)
//     );
//     this.unsubscribers.push(unsubscribe);
//   }

//   loadMore(): void {
//     if (!this.hasMore || this.isLoadingMore) {
//       return;
//     }

//     this.isLoadingMore = true;

//     const unsubscribe = this.articleService.getArticles(
//       this.pageSize,
//       this.onChanges.bind(this),
//       this.onError.bind(this)
//     );
//     this.unsubscribers.push(unsubscribe);
//   }

//   onChanges(newArticles: Article[]): void {
//     if (newArticles.length === 0) {
//       this.isLoading = false;
//       this.isLoadingMore = false;
//       return;
//     }

//     if (newArticles.length < this.pageSize) {
//       this.hasMore = false;
//     }

//     for (const newArticle of newArticles) {
//       const index = this.articles.findIndex(
//         (article) => article.id === newArticle.id
//       );

//       if (index !== -1) {
//         this.articles[index] = newArticle;
//       } else {
//         this.articles.push(newArticle);
//       }
//     }

//     this.isLoading = false;
//     this.isLoadingMore = false;
//   }

//   onError(error: any): void {
//     this.errorService.handleError(this, error.code, firebaseErrorMessages);

//     this.isLoading = false;
//     this.isLoadingMore = false;
//   }

//   onFilter(category: string): void {
//     this.router.navigate(["/articles/category", category]);
//   }

//   openAuthorProfile(authorId: string): void {
//     this.router.navigate(["/users", authorId]);
//   }

//   toggleMenu(): void {
//     this.isMenuOpened = !this.isMenuOpened;
//   }

//   ngOnDestroy(): void {
//     this.unsubscribers.forEach((unsubscribe) => unsubscribe());
//   }
// }

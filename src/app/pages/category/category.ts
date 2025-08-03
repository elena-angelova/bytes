import { Component, OnInit } from "@angular/core";
import { Article } from "../../types";
import { ArticleService } from "../../services/article.service";
import { ActivatedRoute, Router } from "@angular/router";
import { map, Subscription, switchMap, tap } from "rxjs";
import { SectionTitleComponent } from "../../shared/section-title/section-title";
import { ArticleGridComponent } from "../../features/article/article-grid/article-grid";
import { EmptyStateComponent } from "../../shared/empty-state/empty-state";
import { LoaderComponent } from "../../shared/loader/loader";
import { AuthService } from "../../services/auth.service";
import { ToastNotificationComponent } from "../../shared/toast-notification/toast-notification";
import { firebaseErrorMessages } from "../../config";
import { ErrorService } from "../../services/error.service";
import { FirebaseError } from "firebase/app";

@Component({
  selector: "app-category",
  imports: [
    SectionTitleComponent,
    ArticleGridComponent,
    EmptyStateComponent,
    LoaderComponent,
    ToastNotificationComponent,
  ],
  templateUrl: "./category.html",
  styleUrl: "./category.css",
})
export class CategoryComponent implements OnInit {
  category!: string;
  articles: Article[] | undefined;
  isLoading: boolean = true;
  isLoggedIn!: boolean;
  serverErrorMessage: string = "";
  hasError: boolean = false;

  private currentUserSub?: Subscription;
  private routeSub?: Subscription;

  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private errorService: ErrorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  //! Implement infinite scroll
  ngOnInit(): void {
    this.currentUserSub = this.authService.currentUser$.subscribe(
      (currentUser) => (this.isLoggedIn = !!currentUser)
    );

    this.routeSub = this.route.paramMap
      .pipe(
        map((params) => params.get("category")!),
        tap((category) => (this.category = category)),
        switchMap((category) =>
          this.articleService.getArticlesByCategory(category)
        )
      )
      .subscribe({
        next: (articles) => {
          this.articles = articles;
          this.isLoading = false;
        },
        error: (error: FirebaseError) => {
          this.errorService.handleError(
            this,
            error.code,
            firebaseErrorMessages
          );

          this.isLoading = false;
        },
      });
  }

  openAuthorProfile(authorId: string) {
    this.router.navigate(["/users", authorId]);
  }

  ngOnDestroy() {
    this.currentUserSub?.unsubscribe();
    this.routeSub?.unsubscribe();
  }
}

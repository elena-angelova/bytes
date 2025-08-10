import { Component, OnDestroy, OnInit, signal } from "@angular/core";
import { ArticleHeaderComponent } from "../../features/article/article-header/article-header";
import { ArticleContentComponent } from "../../features/article/article-content/article-content";
import { ArticleService } from "../../services/article.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Article } from "../../types";
import { combineLatest, map, of, Subscription, switchMap } from "rxjs";
import { LoaderComponent } from "../../shared/loader/loader";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { AuthService } from "../../services/auth.service";
import { ModalService } from "../../services/modal.service";
import { UserService } from "../../services/user.service";
import { ErrorService } from "../../services/error.service";
import {
  customErrorMessages,
  domErrorMessages,
  firebaseErrorMessages,
} from "../../config";
import { ToastNotificationComponent } from "../../shared/toast-notification/toast-notification";

@Component({
  selector: "app-article-details",
  imports: [
    ArticleHeaderComponent,
    ArticleContentComponent,
    LoaderComponent,
    ToastNotificationComponent,
  ],
  templateUrl: "./article-details.html",
  styleUrl: "./article-details.css",
})
export class ArticleDetailsComponent implements OnInit, OnDestroy {
  currentUserId: string | undefined;
  articleId: string = "";
  article!: Article;
  sanitizedContent: SafeHtml | null = null;

  isLoading = signal(true);
  isOwner: boolean = false;
  isCopied: boolean = false;
  hasLiked: boolean = false;
  hasBookmarked: boolean = false;

  hasError: boolean = false;
  serverErrorMessage: string = "";

  private routeSub?: Subscription;

  constructor(
    private authService: AuthService,
    private articleService: ArticleService,
    private userService: UserService,
    private modalService: ModalService,
    private errorService: ErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Get current user UID and article ID
    this.routeSub = combineLatest([
      this.authService.currentUser$.pipe(map((user) => user?.uid)),
      this.route.paramMap.pipe(map((params) => params.get("articleId")!)),
    ])
      .pipe(
        switchMap(([currentUserId, articleId]) => {
          this.currentUserId = currentUserId;
          this.articleId = articleId;

          // Fetch article details and current user's data (if logged in)
          return combineLatest([
            this.articleService.getSingleArticle(articleId),
            currentUserId
              ? this.userService.getUserData(currentUserId)
              : of(null),
          ]);
        })
      )
      .subscribe({
        next: ([article, userData]) => {
          if (!article) {
            this.isLoading.set(false);
            this.router.navigate(["/not-found"]);
            return;
          }

          this.article = article;
          this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(
            article.content
          );

          // Check if current user (if any) has already liked the article
          this.hasLiked = this.currentUserId
            ? article.likedBy.includes(this.currentUserId)
            : false;

          // Check if current user (if any) has already bookmarked the article
          this.hasBookmarked = userData
            ? userData.readingList.includes(this.articleId)
            : false;

          this.isLoading.set(false);
        },
        error: (error: any) => {
          this.errorService.handleError(
            this,
            error.code,
            firebaseErrorMessages
          );

          this.isLoading.set(false);
        },
      });
  }

  // Handle like/unlike
  async onLike(): Promise<void> {
    if (!this.article) {
      const errorCode = "article/not-found";
      this.errorService.handleError(this, errorCode, customErrorMessages);
      return;
    }

    // Open the login modal if not logged in
    if (!this.currentUserId) {
      this.modalService.openLoginModal();
      return;
    }

    // Prevent owners from liking their own articles and show a pop-up message
    if (this.currentUserId === this.article.authorId) {
      this.isOwner = true;
      setTimeout(() => (this.isOwner = false), 3000);
      return;
    }

    try {
      // Toggle like status: unlike if already liked, otherwise like the article
      if (this.hasLiked) {
        await this.articleService.unlikeArticle(
          this.articleId,
          this.currentUserId
        );
      } else {
        await this.articleService.likeArticle(
          this.articleId,
          this.currentUserId
        );
      }
    } catch (error: any) {
      this.errorService.handleError(this, error.code, firebaseErrorMessages);
    }
  }

  // Handle adding/removing the article from the current user's reading list
  async onBookmark() {
    if (!this.article) {
      const errorCode = "article/not-found";
      this.errorService.handleError(this, errorCode, customErrorMessages);
      return;
    }

    // Open the login modal if not logged in
    if (!this.currentUserId) {
      this.modalService.openLoginModal();
      return;
    }

    try {
      // Toggle bookmark status: remove bookmark if already bookmarked, otherwise add bookmark
      if (this.hasBookmarked) {
        await this.userService.removeBookmark(
          this.currentUserId,
          this.articleId
        );
      } else {
        await this.userService.addBookmark(this.currentUserId, this.articleId);
      }
    } catch (error: any) {
      this.errorService.handleError(this, error.code, firebaseErrorMessages);
    }
  }

  // Copy article's URL to clipboard and show a pop-up confirmation
  async onShare() {
    const currentUrl = window.location.origin + this.router.url;

    try {
      await navigator.clipboard.writeText(currentUrl);
      this.isCopied = true;
      setTimeout(() => (this.isCopied = false), 3000);
    } catch (error: any) {
      this.errorService.handleError(this, error.name, domErrorMessages);
    }
  }

  // Open delete confirmation modal
  onDelete(): void {
    const articleData: Partial<Article> = {
      id: this.articleId,
      authorId: this.article.authorId,
    };
    this.modalService.openArticleDeleteModal(articleData);
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}

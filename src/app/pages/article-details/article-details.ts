import { Component, OnInit } from "@angular/core";
import { ArticleHeaderComponent } from "../../features/article/article-header/article-header";
import { ArticleContentComponent } from "../../features/article/article-content/article-content";
import { ArticleService } from "../../services/article.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Article } from "../../types";
import {
  forkJoin,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
  take,
  tap,
} from "rxjs";
import { LoaderComponent } from "../../shared/loader/loader";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { AuthService } from "../../services/auth.service";
import { ModalService } from "../../services/modal.service";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-article-details",
  imports: [ArticleHeaderComponent, ArticleContentComponent, LoaderComponent],
  templateUrl: "./article-details.html",
  styleUrl: "./article-details.css",
})
export class ArticleDetailsComponent implements OnInit {
  likes$: Observable<number> = of(0);

  currentUserId!: string | undefined;
  articleId!: string;
  article!: Article;
  sanitizedContent: SafeHtml | null = null;

  isLoading: boolean = true;
  isCopied: boolean = false;
  isOwner: boolean = false;
  hasLiked: boolean = false;
  hasBookmarked: boolean = false;

  private routeSub!: Subscription;

  constructor(
    private authService: AuthService,
    private articleService: ArticleService,
    private userService: UserService,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.routeSub = this.authService.currentUser$
      .pipe(
        switchMap((user) => {
          this.currentUserId = user?.uid;

          return this.route.paramMap.pipe(
            switchMap((params) => {
              this.articleId = params.get("articleId")!;

              return forkJoin({
                article: this.articleService
                  .getSingleArticle(this.articleId)
                  .pipe(take(1)),
                userData: this.currentUserId
                  ? this.userService
                      .getUserData(this.currentUserId)
                      .pipe(take(1))
                  : of(null),
              });
            })
          );
        }),
        tap(({ article, userData }) => {
          if (!article) {
            //! Add error handling
            return;
          }

          this.article = article;
          this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(
            article.content
          );

          this.hasLiked = this.currentUserId
            ? article.likedBy.includes(this.currentUserId)
            : false;
          this.hasBookmarked = userData
            ? userData.readingList.includes(this.articleId)
            : false;

          this.isLoading = false;
        })
      )
      .subscribe();

    this.likes$ = this.route.paramMap.pipe(
      map((params) => params.get("articleId")),
      switchMap((articleId) =>
        this.articleService
          .getSingleArticle(articleId!)
          .pipe(map((article) => article?.likes ?? 0))
      )
    );
  }

  openAuthorProfile(authorId: string | undefined): void {
    this.router.navigate(["/users", authorId]);
  }

  async onLike(): Promise<void> {
    if (!this.article) {
      //! Add error handling
      return;
    }

    if (!this.currentUserId) {
      this.modalService.openLoginModal();
      return;
    }

    if (this.currentUserId === this.article.authorId) {
      this.isOwner = true;
      setTimeout(() => (this.isOwner = false), 3000);

      return;
    }

    try {
      if (this.hasLiked) {
        await this.articleService.unlikeArticle(
          this.articleId,
          this.currentUserId
        );

        this.hasLiked = false;
      } else {
        await this.articleService.likeArticle(
          this.articleId,
          this.currentUserId
        );

        this.hasLiked = true;
      }
    } catch (error) {
      //! Add error handling
    }
  }

  async onBookmark() {
    if (!this.article) {
      //! Add error handling
      return;
    }

    if (!this.currentUserId) {
      this.modalService.openLoginModal();
      return;
    }

    if (this.hasBookmarked) {
      await this.userService.removeBookmark(this.currentUserId, this.articleId);

      this.hasBookmarked = false;
    } else {
      await this.userService.addBookmark(this.currentUserId, this.articleId);

      this.hasBookmarked = true;
    }
  }

  async onShare() {
    const currentUrl = window.location.origin + this.router.url;
    try {
      await navigator.clipboard.writeText(currentUrl);

      this.isCopied = true;
      setTimeout(() => (this.isCopied = false), 3000);
    } catch (error) {
      //! Add error handling
    }
  }

  onDelete(): void {
    this.modalService.openArticleDeleteModal(this.articleId);
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
}

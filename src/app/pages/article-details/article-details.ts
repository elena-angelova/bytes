import { Component, OnInit } from "@angular/core";
import { ArticleHeaderComponent } from "../../features/article/article-header/article-header";
import { ArticleContentComponent } from "../../features/article/article-content/article-content";
import { ArticleService } from "../../services/article.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Article } from "../../types";
import { Observable, Subscription, tap } from "rxjs";
import { LoaderComponent } from "../../shared/loader/loader";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { AuthService } from "../../services/auth.service";
import { ModalService } from "../../services/modal.service";

@Component({
  selector: "app-article-details",
  imports: [ArticleHeaderComponent, ArticleContentComponent, LoaderComponent],
  templateUrl: "./article-details.html",
  styleUrl: "./article-details.css",
})
export class ArticleDetailsComponent implements OnInit {
  article$!: Observable<Article | undefined>;
  article!: Article;
  articleId!: string;
  sanitizedContent: SafeHtml | null = null;

  currentUserId!: string | undefined;
  isLoading: boolean = true;
  hasLiked: boolean = false;

  private routeSub!: Subscription;
  private articleSub!: Subscription;

  constructor(
    private authService: AuthService,
    private articleService: ArticleService,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      this.articleId = params.get("articleId")!;
      this.currentUserId = this.authService.getCurrentUser()?.uid;

      this.article$ = this.articleService.getSingleArticle(this.articleId).pipe(
        tap((data) => {
          this.isLoading = false;

          this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(
            data?.content || ""
          );
        })
      );

      this.articleSub = this.article$.subscribe((articleData) => {
        const currentUserId = this.authService.getCurrentUser()?.uid;

        if (!articleData || !currentUserId) {
          //! Add error handling
          return;
        }

        this.article = articleData;
        this.hasLiked = articleData.likedBy?.includes(currentUserId);
      });
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.articleSub.unsubscribe();
  }

  onAuthorClick(authorId: string | undefined): void {
    this.router.navigate(["/users", authorId]);
  }

  async onLikeClick(data: {
    likedBy: string[] | undefined;
    heartIcon: HTMLElement;
  }): Promise<void> {
    const currentUserId = this.authService.getCurrentUser()?.uid;

    //* Make sure that when a user updates the likes, they can only arrayUnion() their own UID
    if (!data.likedBy || !currentUserId) {
      //! Add error handling
      return;
    }

    if (currentUserId === this.article?.authorId) {
      //! Add error handling
      return;
    }

    this.hasLiked = data.likedBy.includes(currentUserId);

    try {
      if (this.hasLiked) {
        await this.articleService.unlikeArticle(this.articleId, currentUserId);
        data.heartIcon.classList.remove("liked");
      } else {
        await this.articleService.likeArticle(this.articleId, currentUserId);
        data.heartIcon.classList.add("liked");
      }
    } catch (error) {
      //! Add error handling
    }
  }

  onDeleteClick(): void {
    this.modalService.openArticleDeleteModal(this.articleId);
  }
}

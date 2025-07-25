import { Component, OnInit } from "@angular/core";
import { ArticleHeaderComponent } from "../../features/article/article-header/article-header";
import { ArticleContentComponent } from "../../features/article/article-content/article-content";
import { ArticlesService } from "../../services/articles.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Article } from "../../types";
import { Observable, Subscription, tap } from "rxjs";
import { LoaderComponent } from "../../ui/loader/loader";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-article-details",
  imports: [ArticleHeaderComponent, ArticleContentComponent, LoaderComponent],
  templateUrl: "./article-details.html",
  styleUrl: "./article-details.css",
})
export class ArticleDetailsComponent implements OnInit {
  article$!: Observable<Article | undefined>;
  article!: Article | undefined;
  articleId!: string;
  sanitizedContent: SafeHtml | null = null;

  isLoading: boolean = true;
  hasLiked: boolean = false;

  private routeSub!: Subscription;
  private articleSub!: Subscription;

  constructor(
    private authService: AuthService,
    private articleService: ArticlesService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      this.articleId = params.get("articleId")!;

      this.article$ = this.articleService.getSingleArticle(this.articleId).pipe(
        tap((data) => {
          this.isLoading = false;

          this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(
            data?.content || ""
          );
        })
      );

      this.articleSub = this.article$.subscribe((articleData) => {
        this.article = articleData;

        const currentUserId = this.authService.getCurrentUser()?.uid;

        if (!articleData || !currentUserId) {
          //! Add error handling
          return;
        }

        this.hasLiked = articleData.likedBy?.includes(currentUserId);
      });
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.articleSub.unsubscribe();
  }

  onAuthorClick(authorId: string | undefined) {
    this.router.navigate(["/users", authorId]);
  }

  async onLikeClick(data: {
    likedBy: string[] | undefined;
    heartIcon: HTMLElement;
  }) {
    const currentUserId = this.authService.getCurrentUser()?.uid;

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
}

import { Component, OnInit } from "@angular/core";
import { ArticleHeaderComponent } from "../../features/article/article-header/article-header";
import { ArticleContentComponent } from "../../features/article/article-content/article-content";
import { ArticlesService } from "../../services/articles.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Article } from "../../types";
import { tap } from "rxjs";
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
  article!: Article | undefined;
  articleId!: string;
  isLoading: boolean = true;
  sanitizedContent: SafeHtml | null = null;
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private articleService: ArticlesService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((user) => {
      this.isLoggedIn = user ? true : false;
    });

    this.route.paramMap.subscribe((params) => {
      this.articleId = params.get("articleId")!;

      this.articleService
        .getSingleArticle(this.articleId)
        .pipe(tap(() => (this.isLoading = false)))
        .subscribe({
          next: (data) => {
            this.article = data;

            this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(
              this.article?.content || ""
            );
          },
          error: (err) => console.log(err), //! Add error handling
        });
    });
  }

  onAuthorClick(authorId: string | undefined) {
    this.router.navigate(["/users", authorId]);
  }
}

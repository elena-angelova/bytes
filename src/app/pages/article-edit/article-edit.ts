import { Component, inject, OnInit, signal, ViewChild } from "@angular/core";
import { articleCategories } from "../../config";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { ArticleService } from "../../services/article.service";
import { UploadService } from "../../services/upload.service";
import { ActivatedRoute, Router } from "@angular/router";
import { map, Observable, Subscription, tap } from "rxjs";
import {
  Article,
  CloudinaryUploadResponse,
  ArticleFormValues,
  ArticleUpdate,
} from "../../types";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ArticleHeaderFormComponent } from "../../features/article/article-header-form/article-header-form";
import { TextEditorComponent } from "../../features/article/text-editor/text-editor";
import { ToastNotificationComponent } from "../../shared/toast-notification/toast-notification";
import DOMPurify from "dompurify";
import { LoaderComponent } from "../../shared/loader/loader";

@Component({
  selector: "app-article-edit",
  imports: [
    ReactiveFormsModule,
    ArticleHeaderFormComponent,
    TextEditorComponent,
    ToastNotificationComponent,
    LoaderComponent,
  ],
  templateUrl: "./article-edit.html",
  styleUrl: "./article-edit.css",
})
export class ArticleEditComponent implements OnInit {
  @ViewChild(TextEditorComponent) textEditor!: TextEditorComponent;

  contentSignal = signal<string>("");

  articleId!: string;
  article!: Article;
  articleCategories: string[] = articleCategories;
  isLoadingEditor: boolean = true;
  isLoading: boolean = false;

  sanitizedContent: SafeHtml | null = null;
  imageFile!: File;
  fileName!: string;
  previewFileUrl!: string;

  hasError: boolean = false;
  isFormInvalid: boolean = false;
  serverErrorMessage!: string;

  private formBuilder = inject(FormBuilder);
  editArticleForm: FormGroup = this.formBuilder.group({
    title: ["", Validators.required],
    category: ["", Validators.required],
    content: ["", Validators.required],
  });

  firebaseErrorMessagesMap: Record<string, string> = {
    internal: "Something went wrong. Please try again.",
    "permission-denied": "You don't have permission to perform this action.",
    "deadline-exceeded":
      "Request timed out. Please check your connection and try again.",
    unavailable:
      "Service is temporarily unavailable. Please check your connection or try again later.",
    unauthenticated: "You need to be signed in to perform this action.",
  };

  private routeSub?: Subscription;
  private imageUploadSub?: Subscription;
  private articleSub?: Subscription;

  constructor(
    private authService: AuthService,
    private articleService: ArticleService,
    private uploadService: UploadService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      this.articleId = params.get("articleId")!;

      this.articleSub = this.articleService
        .getSingleArticle(this.articleId)
        .pipe(
          tap((data) => {
            this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(
              data?.content || ""
            );
          })
        )
        .subscribe({
          next: (articleData) => {
            if (!articleData) {
              this.serverErrorMessage =
                "Looks like the article's missing or has been removed.";

              this.hasError = true;
              setTimeout(() => (this.hasError = false), 4000);

              this.isLoadingEditor = false;
              return;
            }

            this.editArticleForm.patchValue({
              title: articleData.title,
              category: articleData.category,
              content: articleData.content,
            });

            this.contentSignal.set(articleData.content);
            this.previewFileUrl = articleData.thumbnailUrl;
            this.article = articleData;

            this.isLoadingEditor = false;
          },
          error: (error) => {
            this.serverErrorMessage =
              this.firebaseErrorMessagesMap[error.code] ||
              "An unexpected error occurred. Please try again.";

            this.hasError = true;
            setTimeout(() => (this.hasError = false), 4000);
          },
        });
    });
  }

  onFileSelected(file: File) {
    this.fileName = file.name;
    this.imageFile = file;
    this.previewFileUrl = URL.createObjectURL(file);
  }

  onFormSubmit() {
    const content: string = this.textEditor.getHtml();

    if (this.editArticleForm.valid) {
      this.isFormInvalid = false;

      const sanitizedContent: string = DOMPurify.sanitize(content);

      const formValues: ArticleFormValues = this.editArticleForm.value;
      const category: string = formValues.category;
      const title: string = formValues.title;
      const preview: string = formValues.content
        .split(/\s+/)
        .slice(0, 50)
        .join(" ");

      const currentUser = this.authService.getCurrentUser();
      const authorId: string | undefined = currentUser?.uid;
      const isOwner = authorId === this.article.authorId;

      if (authorId && isOwner) {
        this.isLoading = true;

        const baseArticleData = {
          category,
          content: sanitizedContent,
          preview,
          title,
        };

        if (!this.imageFile) {
          const thumbnailUrl = this.article.thumbnailUrl;
          this.onEdit({
            ...baseArticleData,
            thumbnailUrl,
          });
        } else {
          this.imageUploadSub = this.uploadImage()
            .pipe(
              map((thumbnailUrl) => ({
                ...baseArticleData,
                thumbnailUrl,
              }))
            )
            .subscribe({
              next: (articleData) => {
                this.onEdit(articleData);
              },
              error: () => {
                this.serverErrorMessage =
                  "Whoops! The image failed to upload. Make sure it's under 10MB and give it another go.";

                this.hasError = true;
                setTimeout(() => (this.hasError = false), 4000);

                this.isLoading = false;
                return;
              },
            });
        }
      } else {
        this.serverErrorMessage =
          "Only the author can edit this article. Make sure you're signed in with the right account.";

        this.hasError = true;
        setTimeout(() => (this.hasError = false), 4000);

        this.isLoading = false;
      }
    } else {
      this.isFormInvalid = true;
      this.editArticleForm.markAllAsTouched();
    }
  }

  uploadImage(): Observable<string> {
    return this.uploadService
      .upload(this.imageFile)
      .pipe(map((response: CloudinaryUploadResponse) => response.secure_url));
  }

  async onEdit(articleData: ArticleUpdate): Promise<void> {
    try {
      await this.articleService.editArticle(articleData, this.articleId);

      this.router.navigate(["/articles", this.articleId]);
    } catch (error: any) {
      this.serverErrorMessage =
        this.firebaseErrorMessagesMap[error.code] ||
        "An unexpected error occurred. Please try again.";
    } finally {
      this.isLoading = false;
    }
  }

  onCancel() {
    this.router.navigate(["/articles", this.articleId]);
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    this.imageUploadSub?.unsubscribe();
    this.articleSub?.unsubscribe();
  }
}

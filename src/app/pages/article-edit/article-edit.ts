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
import { map, Observable, tap } from "rxjs";
import {
  Article,
  CloudinaryUploadResponse,
  ArticleFormValues,
  ArticleUpdate,
} from "../../types";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ArticleHeaderFormComponent } from "../../features/article/article-header-form/article-header-form";
import { TextEditorComponent } from "../../features/article/text-editor/text-editor";
import { LoaderComponent } from "../../shared/loader/loader";
import { ErrorMessageComponent } from "../../shared/error-message/error-message";
import DOMPurify from "dompurify";

@Component({
  selector: "app-article-edit",
  imports: [
    ReactiveFormsModule,
    ArticleHeaderFormComponent,
    TextEditorComponent,
    LoaderComponent,
    ErrorMessageComponent,
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
  isLoading: boolean = true;

  sanitizedContent: SafeHtml | null = null;
  thumbnailFile!: File;
  fileName!: string;
  previewFileUrl!: string;

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

  constructor(
    private authService: AuthService,
    private articleService: ArticleService,
    private uploadService: UploadService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.articleId = params.get("articleId")!;

      this.articleService
        .getSingleArticle(this.articleId)
        .pipe(
          tap((data) => {
            this.isLoading = false;

            this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(
              data?.content || ""
            );
          })
        )
        .subscribe({
          next: (articleData) => {
            if (!articleData) {
              //! Add error handling
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
          },
          error: (err) => console.log(err), //! Add error handling
        });
    });
  }

  onFileSelected(file: File) {
    this.fileName = file.name;
    this.thumbnailFile = file;
    this.previewFileUrl = URL.createObjectURL(file);
  }

  uploadThumbnail(): Observable<string> {
    return this.uploadService
      .upload(this.thumbnailFile)
      .pipe(map((response: CloudinaryUploadResponse) => response.secure_url));
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
      //! Do I need this check as well? I will have a route guard for the buttons and the Firestore rules also don't allow non-authors to update.
      const isOwner = authorId === this.article.authorId;

      if (authorId && isOwner) {
        this.isLoading = true;

        const baseArticleData = {
          category,
          content: sanitizedContent,
          preview,
          title,
        };

        if (!this.thumbnailFile) {
          const thumbnailUrl = this.article.thumbnailUrl;
          this.onEdit({
            ...baseArticleData,
            thumbnailUrl,
          });
        } else {
          this.uploadThumbnail()
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
              error: (err) => {}, //! Add error handling for Cloudinary errors
            });
        }
      } //! Add error handling if there's no authorId (no logged in user)
    } else {
      this.isFormInvalid = true;
      this.editArticleForm.markAllAsTouched();
    }
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
}

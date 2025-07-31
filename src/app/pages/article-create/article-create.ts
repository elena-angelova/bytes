import { Component, inject, ViewChild } from "@angular/core";
import { articleCategories } from "../../config";
import { ArticleHeaderFormComponent } from "../../features/article/article-header-form/article-header-form";
import { TextEditorComponent } from "../../features/article/text-editor/text-editor";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  Article,
  CloudinaryUploadResponse,
  ArticleFormValues,
} from "../../types";
import { AuthService } from "../../services/auth.service";
import { Timestamp } from "@angular/fire/firestore";
import { ArticleService } from "../../services/article.service";
import { Router } from "@angular/router";
import DOMPurify from "dompurify";
import { UploadService } from "../../services/upload.service";
import { map, Observable, Subscription } from "rxjs";
import { ToastNotificationComponent } from "../../shared/toast-notification/toast-notification";

@Component({
  selector: "app-article-editor",
  imports: [
    ReactiveFormsModule,
    ArticleHeaderFormComponent,
    TextEditorComponent,
    ToastNotificationComponent,
  ],
  templateUrl: "./article-create.html",
  styleUrl: "./article-create.css",
})
export class ArticleCreateComponent {
  @ViewChild(TextEditorComponent) textEditor!: TextEditorComponent;

  articleCategories: string[] = articleCategories;
  isLoading: boolean = false;

  imageFile!: File;
  fileName!: string;
  previewFileUrl!: string;

  isFormInvalid: boolean = false;
  hasError: boolean = false;
  serverErrorMessage!: string;

  private formBuilder = inject(FormBuilder);
  createArticleForm: FormGroup = this.formBuilder.group({
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

  private imageUploadSub?: Subscription;

  constructor(
    private authService: AuthService,
    private articleService: ArticleService,
    private uploadService: UploadService,
    private router: Router
  ) {}

  onFileSelected(file: File) {
    this.fileName = file.name;
    this.imageFile = file;
    this.previewFileUrl = URL.createObjectURL(file);
  }

  uploadImage(): Observable<string> {
    return this.uploadService
      .upload(this.imageFile)
      .pipe(map((response: CloudinaryUploadResponse) => response.secure_url));
  }

  onFormSubmit(): void {
    const content: string = this.textEditor.getHtml();

    if (this.createArticleForm.valid && this.imageFile) {
      this.isFormInvalid = false;

      const sanitizedContent: string = DOMPurify.sanitize(content);

      const formValues: ArticleFormValues = this.createArticleForm.value;
      const category: string = formValues.category;
      const title: string = formValues.title;
      const preview: string = formValues.content
        .split(/\s+/)
        .slice(0, 50)
        .join(" ");

      const currentUser = this.authService.getCurrentUser();
      const authorId: string | undefined = currentUser?.uid;
      const authorName: string = currentUser?.displayName ?? "";

      if (authorId) {
        this.isLoading = true;

        const baseArticleData = {
          authorId,
          authorName,
          category,
          content: sanitizedContent,
          likes: 0,
          likedBy: [],
          preview,
          title,
          createdAt: Timestamp.now(),
        };

        this.imageUploadSub = this.uploadImage()
          .pipe(
            map((thumbnailUrl) => ({
              ...baseArticleData,
              thumbnailUrl,
            }))
          )
          .subscribe({
            next: (articleData) => {
              this.onCreate(articleData);
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
      } else {
        this.serverErrorMessage =
          "You're not logged in. Please sign in to continue.";

        this.hasError = true;
        setTimeout(() => (this.hasError = false), 4000);

        this.isLoading = false;
      }
    } else {
      this.isFormInvalid = true;
      setTimeout(() => (this.isFormInvalid = false), 3000);
      this.createArticleForm.markAllAsTouched();
    }
  }

  async onCreate(articleData: Article): Promise<void> {
    try {
      const docRef = await this.articleService.createArticle(articleData);
      const articleId = docRef.id;

      this.createArticleForm.reset();
      this.router.navigate(["/articles", articleId]);
    } catch (error: any) {
      this.serverErrorMessage =
        this.firebaseErrorMessagesMap[error.code] ||
        "An unexpected error occurred. Please try again.";

      this.hasError = true;
      setTimeout(() => (this.hasError = false), 4000);
    } finally {
      this.isLoading = false;
    }
  }

  onCancel() {
    this.router.navigate(["/articles"]);
  }

  ngOnDestroy() {
    this.imageUploadSub?.unsubscribe;
  }
}

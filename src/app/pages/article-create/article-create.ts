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
import { ArticlesService } from "../../services/articles.service";
import { Router } from "@angular/router";
import { LoaderComponent } from "../../shared/loader/loader";
import { ErrorMessageComponent } from "../../shared/error-message/error-message";
import DOMPurify from "dompurify";
import { UploadService } from "../../services/upload.service";
import { map, Observable } from "rxjs";

@Component({
  selector: "app-article-editor",
  imports: [
    ReactiveFormsModule,
    ArticleHeaderFormComponent,
    TextEditorComponent,
    LoaderComponent,
    ErrorMessageComponent,
  ],
  templateUrl: "./article-create.html",
  styleUrl: "./article-create.css",
})
export class ArticleCreateComponent {
  @ViewChild(TextEditorComponent) textEditor!: TextEditorComponent;

  articleCategories: string[] = articleCategories;
  isLoading: boolean = false;

  thumbnailFile!: File;
  fileName!: string;
  previewFileUrl!: string;

  isFormInvalid: boolean = false;
  serverErrorMessage!: string;

  private formBuilder = inject(FormBuilder);
  createArticleForm: FormGroup = this.formBuilder.group({
    title: ["", Validators.required],
    category: ["", Validators.required],
    content: ["", Validators.required],
  });

  firebaseErrorMessagesMap: Record<string, string> = {
    "auth/internal-error": "Something went wrong. Please try again.",
    "auth/network-request-failed":
      "Network error. Please check your internet connection.",
  };

  constructor(
    private authService: AuthService,
    private articleService: ArticlesService,
    private uploadService: UploadService,
    private router: Router
  ) {}

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

  onFormSubmit(): void {
    const content: string = this.textEditor.getHtml();

    if (this.createArticleForm.valid && this.thumbnailFile) {
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

        this.uploadThumbnail()
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
            error: (err) => {}, //! Add error handling if there's no authorId (no logged in user) and for Cloudinary errors
          });
      }
    } else {
      this.isFormInvalid = true;
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
    } finally {
      this.isLoading = false;
    }
  }
}

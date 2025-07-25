import { Component, inject } from "@angular/core";
import { articleCategories } from "../../config";
import { ArticleMetaComponent } from "./article-meta/article-meta";
import { TextEditorComponent } from "./text-editor/text-editor";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  Article,
  CloudinaryUploadResponse,
  CreateFormValues,
} from "../../types";
import { AuthService } from "../../services/auth.service";
import { Timestamp } from "@angular/fire/firestore";
import { ArticlesService } from "../../services/articles.service";
import { Router } from "@angular/router";
import { LoaderComponent } from "../../ui/loader/loader";
import { ErrorMessageComponent } from "../../ui/error-message/error-message";
import DOMPurify from "dompurify";
import { UploadService } from "../../services/upload.service";
import { map, Observable } from "rxjs";

@Component({
  selector: "app-article-editor",
  imports: [
    ReactiveFormsModule,
    ArticleMetaComponent,
    TextEditorComponent,
    LoaderComponent,
    ErrorMessageComponent,
  ],
  templateUrl: "./article-editor.html",
  styleUrl: "./article-editor.css",
})
export class ArticleEditorComponent {
  articleCategories: string[] = articleCategories;
  isLoading: boolean = false;

  rawHTML!: string;
  thumbnailFile!: File;

  isFormInvalid: boolean = false;
  serverErrorMessage!: string;

  private formBuilder = inject(FormBuilder);
  createArticleForm: FormGroup = this.formBuilder.group({
    title: ["", Validators.required],
    category: ["", Validators.required],
    thumbnailUrl: ["", Validators.required],
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

  getRawHTML(html: string) {
    this.rawHTML = html;
  }

  onFileSelected(file: File) {
    this.thumbnailFile = file;
  }

  uploadThumbnail(): Observable<string> {
    return this.uploadService
      .upload(this.thumbnailFile)
      .pipe(map((response: CloudinaryUploadResponse) => response.secure_url));
  }

  onFormSubmit(): void {
    if (this.createArticleForm.valid) {
      this.isFormInvalid = false;

      const formValues: CreateFormValues = this.createArticleForm.value;

      const content: string = DOMPurify.sanitize(this.rawHTML);
      const category: string = formValues.category;
      const title: string = formValues.title;
      const preview: string = formValues.content
        .split(/\s+/)
        .slice(0, 50)
        .join(" ");

      const currentUser = this.authService.getCurrentUser();
      const authorId: string | undefined = currentUser?.uid;
      const authorName: string = currentUser?.displayName ?? "";

      console.log(currentUser);
      console.log(authorName);
      console.log(authorId);

      if (authorId) {
        this.isLoading = true;

        const baseArticleData = {
          authorId,
          authorName,
          category,
          content,
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

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
import { UsersService } from "../../services/users.service";
import { Timestamp } from "@angular/fire/firestore";
import { ArticlesService } from "../../services/articles.service";
import { Router } from "@angular/router";
import { LoaderComponent } from "../../ui/loader/loader";
import { ErrorMessageComponent } from "../../ui/error-message/error-message";
import DOMPurify from "dompurify";
import { UploadService } from "../../services/upload.service";
import { map, Observable, switchMap } from "rxjs";

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
    private userService: UsersService,
    private articleService: ArticlesService,
    private uploadService: UploadService,
    private router: Router
  ) {}

  onFormSubmit(): void {
    if (this.createArticleForm.valid) {
      this.isFormInvalid = false;

      const cleanHTML = DOMPurify.sanitize(this.rawHTML);
      const formValues: CreateFormValues = this.createArticleForm.value;

      const content: string = cleanHTML;
      const category: string = formValues.category;
      const title: string = formValues.title;
      const preview: string = formValues.content.substring(0, 101);
      const likes: string[] = [];
      const createdAt = Timestamp.now();
      const authorId: string | undefined = this.authService.getUser()?.uid;

      //* Consider how to handle if there's no uid (no logged in user) or the server can't find a user with that uid or Cloudinary errors
      if (authorId) {
        this.isLoading = true;

        this.uploadThumbnail()
          .pipe(
            switchMap((thumbnailUrl) =>
              this.userService.getUserData(authorId).pipe(
                map((user) => {
                  const authorName = user
                    ? `${user.firstName} ${user.lastName}`
                    : "";

                  const articleData: Article = {
                    authorId,
                    authorName,
                    category,
                    content,
                    likes,
                    preview,
                    thumbnailUrl,
                    title,
                    createdAt,
                  };

                  return articleData;
                })
              )
            )
          )
          .subscribe({
            next: (articleData) => {
              console.log(articleData); //& Test
              this.onCreate(articleData);
            },
            error: (err) => {}, //*
          });
      }
    } else {
      this.isFormInvalid = true;
      this.createArticleForm.markAllAsTouched();
    }
  }

  getRawHTML(html: string) {
    this.rawHTML = html;
  }

  onFileSelected(file: File) {
    this.thumbnailFile = file;
  }

  // *Think how you'll handle any Cloudinary errors
  uploadThumbnail(): Observable<string> {
    return this.uploadService
      .upload(this.thumbnailFile)
      .pipe(map((response: CloudinaryUploadResponse) => response.secure_url));
  }

  async onCreate(articleData: Article) {
    try {
      const articleId = (await this.articleService.createArticle(articleData))
        .id;

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

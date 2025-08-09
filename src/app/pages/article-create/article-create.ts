import { Component, inject, OnDestroy, ViewChild } from "@angular/core";
import {
  articleCategories,
  cloudinaryErrorMessages,
  customErrorMessages,
  firebaseErrorMessages,
} from "../../config";
import { ArticleHeaderFormComponent } from "../../features/article/article-header-form/article-header-form";
import { TextEditorComponent } from "../../features/article/text-editor/text-editor";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Article, CloudinaryUploadResponse } from "../../types";
import { AuthService } from "../../services/auth.service";
import { Timestamp } from "@angular/fire/firestore";
import { ArticleService } from "../../services/article.service";
import { Router } from "@angular/router";
import DOMPurify from "dompurify";
import { UploadService } from "../../services/upload.service";
import {
  catchError,
  EMPTY,
  finalize,
  from,
  map,
  Observable,
  Subscription,
  switchMap,
  take,
} from "rxjs";
import { ToastNotificationComponent } from "../../shared/toast-notification/toast-notification";
import { ErrorService } from "../../services/error.service";

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
export class ArticleCreateComponent implements OnDestroy {
  @ViewChild(TextEditorComponent) textEditor!: TextEditorComponent;

  articleCategories: string[] = articleCategories;
  isLoading: boolean = false;

  imageFile!: File;
  fileName!: string;
  previewFileUrl!: string;

  isFormInvalid: boolean = false;
  hasError: boolean = false;
  serverErrorMessage: string = "";

  private formBuilder = inject(FormBuilder);
  createArticleForm: FormGroup = this.formBuilder.group({
    title: ["", Validators.required],
    category: ["", Validators.required],
    content: ["", Validators.required],
  });

  private currentUserSub?: Subscription;

  constructor(
    private authService: AuthService,
    private articleService: ArticleService,
    private uploadService: UploadService,
    private errorService: ErrorService,
    private router: Router
  ) {}

  onSubmit(): void {
    const htmlContent: string = this.textEditor.getHtml();

    if (!this.createArticleForm.valid) {
      this.isFormInvalid = true;
      setTimeout(() => (this.isFormInvalid = false), 3000);

      this.createArticleForm.markAllAsTouched();
      return;
    }

    this.isFormInvalid = false;
    this.isLoading = true;

    const sanitizedContent: string = DOMPurify.sanitize(htmlContent);
    const {
      category,
      title,
      content: plainTextContent,
    } = this.createArticleForm.value;

    const preview: string = plainTextContent
      .split(/\s+/)
      .slice(0, 50)
      .join(" ");

    this.currentUserSub = this.authService.currentUser$
      .pipe(
        take(1),
        switchMap((user) => {
          if (!user) {
            const errorCode = "unauthenticated";
            this.errorService.handleError(this, errorCode, customErrorMessages);
            return EMPTY;
          }

          const authorId: string = user.uid;
          const authorName: string = user.displayName ?? "";

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

          return this.uploadImage().pipe(
            catchError((error) => {
              this.errorService.handleError(
                this,
                error.statusText,
                cloudinaryErrorMessages
              );

              return EMPTY;
            }),
            switchMap((thumbnailUrl) => {
              const finalData = {
                ...baseArticleData,
                thumbnailUrl,
              };

              return from(this.onCreate(finalData));
            })
          );
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe();
  }

  uploadImage(): Observable<string> {
    return this.uploadService
      .upload(this.imageFile)
      .pipe(map((response: CloudinaryUploadResponse) => response.secure_url));
  }

  onFileSelected(file: File) {
    this.fileName = file.name;
    this.imageFile = file;
    this.previewFileUrl = URL.createObjectURL(file);
  }

  async onCreate(articleData: Article): Promise<void> {
    try {
      const docRef = await this.articleService.createArticle(articleData);
      const articleId = docRef.id;

      this.createArticleForm.reset();
      this.router.navigate(["/articles", articleId]);
    } catch (error: any) {
      this.errorService.handleError(this, error.code, firebaseErrorMessages);
    } finally {
      this.isLoading = false;
    }
  }

  onCancel() {
    this.router.navigate(["/articles"]);
  }

  ngOnDestroy() {
    this.currentUserSub?.unsubscribe();
  }
}

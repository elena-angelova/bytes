import { Component, inject, OnInit, signal, ViewChild } from "@angular/core";
import {
  articleCategories,
  cloudinaryErrorMessages,
  customErrorMessages,
  firebaseErrorMessages,
} from "../../config";
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
import {
  catchError,
  EMPTY,
  finalize,
  from,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
  take,
  tap,
} from "rxjs";
import { Article, CloudinaryUploadResponse } from "../../types";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ArticleHeaderFormComponent } from "../../features/article/article-header-form/article-header-form";
import { TextEditorComponent } from "../../features/article/text-editor/text-editor";
import { ToastNotificationComponent } from "../../shared/toast-notification/toast-notification";
import DOMPurify from "dompurify";
import { LoaderComponent } from "../../shared/loader/loader";
import { ErrorService } from "../../services/error.service";
import { FirestoreError } from "firebase/firestore";

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
  sanitizedContent: SafeHtml | null = null;
  imageFile!: File;
  fileName!: string;
  previewFileUrl!: string;

  isLoadingEditor: boolean = true;
  isSaving: boolean = false;
  hasError: boolean = false;
  isFormInvalid: boolean = false;
  serverErrorMessage: string = "";

  private formBuilder = inject(FormBuilder);
  editArticleForm: FormGroup = this.formBuilder.group({
    title: ["", Validators.required],
    category: ["", Validators.required],
    content: ["", Validators.required],
  });

  private routeSub?: Subscription;
  private currentUserSub?: Subscription;

  constructor(
    private authService: AuthService,
    private articleService: ArticleService,
    private uploadService: UploadService,
    private errorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap
      .pipe(
        map((params) => params.get("articleId")!),
        tap((articleId) => (this.articleId = articleId)),
        switchMap((articleId) =>
          this.articleService.getSingleArticle(articleId).pipe(
            tap((data) => {
              this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(
                data?.content || ""
              );
            })
          )
        )
      )
      .subscribe({
        next: (articleData) => {
          if (!articleData) {
            const errorCode = "article/not-found";
            this.errorService.handleError(this, errorCode, customErrorMessages);
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
        error: (error: FirestoreError) => {
          this.errorService.handleError(
            this,
            error.code,
            firebaseErrorMessages
          );

          this.isLoadingEditor = false;
        },
      });
  }

  onSubmit(): void {
    const htmlContent: string = this.textEditor.getHtml();

    if (!this.editArticleForm.valid) {
      this.isFormInvalid = true;
      this.editArticleForm.markAllAsTouched();
      return;
    }

    this.isFormInvalid = false;
    this.isSaving = true;

    const sanitizedContent: string = DOMPurify.sanitize(htmlContent);
    const {
      category,
      title,
      content: plainTextContent,
    } = this.editArticleForm.value;

    const preview: string = plainTextContent
      .split(/\s+/)
      .slice(0, 50)
      .join(" ");

    const baseArticleData = {
      category,
      content: sanitizedContent,
      preview,
      title,
    };

    this.currentUserSub = this.authService.currentUser$
      .pipe(
        take(1),
        switchMap((user) => {
          if (!user || user.uid !== this.article.authorId) {
            const errorCode = "unauthorized";
            this.errorService.handleError(this, errorCode, customErrorMessages);
            return EMPTY;
          }

          const thumbnailUrl$ = this.imageFile
            ? this.uploadImage().pipe(
                catchError((error) => {
                  this.errorService.handleError(
                    this,
                    error.statusText,
                    cloudinaryErrorMessages
                  );

                  return EMPTY;
                })
              )
            : of(this.article.thumbnailUrl);

          return thumbnailUrl$.pipe(
            switchMap((thumbnailUrl) => {
              const finalData = {
                ...baseArticleData,
                thumbnailUrl,
              };
              return from(this.onEdit(finalData));
            })
          );
        }),
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe();
  }

  uploadImage(): Observable<string> {
    return this.uploadService
      .upload(this.imageFile)
      .pipe(map((response: CloudinaryUploadResponse) => response.secure_url));
  }

  onFileSelected(file: File): void {
    this.fileName = file.name;
    this.imageFile = file;
    this.previewFileUrl = URL.createObjectURL(file);
  }

  async onEdit(articleData: Partial<Article>): Promise<void> {
    try {
      await this.articleService.editArticle(articleData, this.articleId);
      this.router.navigate(["/articles", this.articleId]);
    } catch (error: any) {
      this.errorService.handleError(this, error.code, firebaseErrorMessages);
    } finally {
      this.isSaving = false;
    }
  }

  onCancel(): void {
    this.router.navigate(["/articles", this.articleId]);
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.currentUserSub?.unsubscribe();
  }
}

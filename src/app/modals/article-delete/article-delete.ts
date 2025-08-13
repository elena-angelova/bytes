import { Component, Inject, OnDestroy } from "@angular/core";
import { ModalComponent } from "../../shared/modal/modal";
import { ModalService } from "../../services/modal.service";
import { ArticleService } from "../../services/article.service";
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { customErrorMessages, firebaseErrorMessages } from "../../config";
import { ErrorService } from "../../services/error.service";
import { AuthService } from "../../services/auth.service";
import { Subscription, take } from "rxjs";
import { Article } from "../../types";

@Component({
  selector: "app-article-delete",
  imports: [ModalComponent],
  templateUrl: "./article-delete.html",
  styleUrl: "./article-delete.css",
})
export class ArticleDeleteModalComponent implements OnDestroy {
  title: string = "Delete article?";
  btnText: string = "Confirm";

  confirmationMessage: string = `Are you sure you want to delete this article?<br>This action is permanent and <strong>cannot be undone</strong>.`;
  serverErrorMessage: string = "";
  isLoading: boolean = false;

  private currentUserSub?: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Partial<Article>,
    private authService: AuthService,
    private articleService: ArticleService,
    private modalService: ModalService,
    private errorService: ErrorService,
    private router: Router
  ) {}

  async onSubmit() {
    this.serverErrorMessage = "";
    this.isLoading = true;

    this.currentUserSub = this.authService.currentUser$
      .pipe(take(1))
      .subscribe({
        next: (user) => {
          // Check authorization before deleting
          if (!user || user.uid !== this.data.authorId) {
            const errorCode = "unauthorized";
            this.errorService.handleError(this, errorCode, customErrorMessages);
            this.isLoading = false;
            return;
          }

          this.onDelete();
        },
        error: (error) => {
          this.errorService.handleError(
            this,
            error.code,
            firebaseErrorMessages
          );
          this.isLoading = false;
        },
      });
  }

  async onDelete(): Promise<void> {
    try {
      await this.articleService.deleteArticle(this.data.id!);
      this.modalService.closeAll();
      this.router.navigate(["/articles"]);
    } catch (error: any) {
      this.errorService.handleError(this, error.code, firebaseErrorMessages);
    } finally {
      this.isLoading = false;
    }
  }

  onCancel() {
    this.modalService.closeAll();
  }

  ngOnDestroy() {
    this.currentUserSub?.unsubscribe();
  }
}

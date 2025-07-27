import { Component, Inject } from "@angular/core";
import { ModalComponent } from "../../shared/modal/modal";
import { ModalService } from "../../services/modal.service";
import { ArticleService } from "../../services/article.service";
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-article-delete",
  imports: [ModalComponent],
  templateUrl: "./article-delete.html",
  styleUrl: "./article-delete.css",
})
export class ArticleDeleteModalComponent {
  title: string = "Delete article?";
  btnText: string = "Confirm";

  confirmationMessage: string = `Are you sure you want to delete this article?<br>This action is permanent and <strong>cannot be undone</strong>.`;
  serverErrorMessage!: string;
  isLoading: boolean = false;

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
    @Inject(MAT_DIALOG_DATA) public data: { articleId: string },
    private articleService: ArticleService,
    private modalService: ModalService,
    private router: Router
  ) {}

  async onSubmit() {
    this.isLoading = true;

    try {
      await this.articleService.deleteArticle(this.data.articleId);

      this.modalService.closeAll();
      await this.router.navigate(["/articles"]);
    } catch (error: any) {
      this.serverErrorMessage =
        this.firebaseErrorMessagesMap[error.code] ||
        "An unexpected error occurred. Please try again.";
    } finally {
      this.isLoading = false;
    }
  }

  onCancel() {
    this.modalService.closeAll();
  }
}

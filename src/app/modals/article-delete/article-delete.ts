import { Component, Inject } from "@angular/core";
import { ModalComponent } from "../../shared/modal/modal";
import { ModalService } from "../../services/modal.service";
import { ArticleService } from "../../services/article.service";
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { firebaseErrorMessages } from "../../config";
import { ErrorService } from "../../services/error.service";

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { articleId: string },
    private articleService: ArticleService,
    private modalService: ModalService,
    private errorService: ErrorService,
    private router: Router
  ) {}

  async onSubmit() {
    this.isLoading = true;

    try {
      await this.articleService.deleteArticle(this.data.articleId);

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
}

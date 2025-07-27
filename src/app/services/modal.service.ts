import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { LoginModalComponent } from "../modals/login/login";
import { ComponentType, Overlay } from "@angular/cdk/overlay";
import { RegisterModalComponent } from "../modals/register/register";
import { ArticleDeleteModalComponent } from "../modals/article-delete/article-delete";

@Injectable({
  providedIn: "root",
})
export class ModalService {
  constructor(private dialog: MatDialog, private overlay: Overlay) {}

  open<T>(modal: ComponentType<T>, data?: unknown) {
    this.dialog.open(modal, {
      data,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
    });
  }

  openLoginModal(): void {
    this.open(LoginModalComponent);
  }

  openRegisterModal(): void {
    this.open(RegisterModalComponent);
  }

  openArticleDeleteModal(articleId: string): void {
    this.open(ArticleDeleteModalComponent, { articleId });
  }

  closeAll(): void {
    this.dialog.closeAll();
  }
}

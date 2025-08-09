import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { LoginModalComponent } from "../modals/login/login";
import { ComponentType, Overlay } from "@angular/cdk/overlay";
import { RegisterModalComponent } from "../modals/register/register";
import { ArticleDeleteModalComponent } from "../modals/article-delete/article-delete";
import { Article } from "../types";

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

  openArticleDeleteModal(articleData: Partial<Article>): void {
    this.open(ArticleDeleteModalComponent, articleData);
  }

  closeAll(): void {
    this.dialog.closeAll();
  }
}

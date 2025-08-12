import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { LoginModalComponent } from "../modals/login/login";
import { ComponentType, Overlay } from "@angular/cdk/overlay";
import { RegisterModalComponent } from "../modals/register/register";
import { ArticleDeleteModalComponent } from "../modals/article-delete/article-delete";
import { Article } from "../types";
import { take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class ModalService {
  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private overlay: Overlay
  ) {}

  open<T>(modal: ComponentType<T>, data?: unknown) {
    this.dialog.open(modal, {
      data,
      scrollStrategy: this.overlay.scrollStrategies.noop(), // Prevent automatic scrolling adjustments when modal is open
    });
  }

  // Open the login modal only if there's no logged-in user
  openLoginModal(): void {
    this.authService.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user) {
        return;
      }

      this.open(LoginModalComponent);
    });
  }

  // Open the registration modal only if there's no logged-in user
  openRegisterModal(): void {
    this.authService.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user) {
        return;
      }

      this.open(RegisterModalComponent);
    });
  }

  // Open the article delete confirmation modal only if the logged-in user is the article's author
  openArticleDeleteModal(articleData: Partial<Article>): void {
    this.authService.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user?.uid !== articleData.authorId) {
        return;
      }

      this.open(ArticleDeleteModalComponent, articleData);
    });
  }

  closeAll(): void {
    this.dialog.closeAll();
  }
}

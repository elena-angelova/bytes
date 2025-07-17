import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { LoginModalComponent } from "../modals/login/login";
import { ComponentType, Overlay } from "@angular/cdk/overlay";
import { RegisterModalComponent } from "../modals/register/register";

@Injectable({
  providedIn: "root",
})
export class ModalService {
  constructor(private dialog: MatDialog, private overlay: Overlay) {}

  open<T>(modal: ComponentType<T>) {
    this.dialog.open(modal, {
      scrollStrategy: this.overlay.scrollStrategies.noop(),
    });
  }

  openLoginModal(): void {
    this.open(LoginModalComponent);
  }

  openRegisterModal(): void {
    this.open(RegisterModalComponent);
  }

  closeAll(): void {
    this.dialog.closeAll();
  }
}

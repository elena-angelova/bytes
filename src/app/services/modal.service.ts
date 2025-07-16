import { Injectable, Type } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { LoginModalComponent } from "../modals/login/login";
import { ComponentType } from "@angular/cdk/overlay";
import { RegisterModalComponent } from "../modals/register/register";

@Injectable({
  providedIn: "root",
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  open<T>(modal: ComponentType<T>) {
    this.dialog.open(modal);
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

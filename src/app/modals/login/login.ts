import { Component, ViewChild } from "@angular/core";
import { FormFieldConfig, LoginFormValues } from "../../types";
import { formFields } from "../../config/form-fields.config";
import { ModalComponent } from "../../ui/modal/modal";
import { ModalService } from "../../services/modal.service";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  imports: [ModalComponent],
  templateUrl: "./login.html",
  styleUrl: "./login.css",
})
export class LoginModalComponent {
  mode: string = "login";
  title: string = "Log in";
  btnText: string = "Log in";
  fieldLayout: string = "column-layout";
  isLoading: boolean = false;

  fields: FormFieldConfig = {
    email: formFields["email"],
    password: formFields["password"],
  };

  firebaseErrorMessagesMap: Record<string, string> = {
    "auth/invalid-credential":
      "Your login information is incorrect. Please try again.",
    "auth/internal-error": "Something went wrong. Please try again.",
    "auth/network-request-failed":
      "Network error. Please check your internet connection.",
  };
  serverErrorMessage!: string;

  @ViewChild(ModalComponent) modalComponent!: ModalComponent;

  constructor(
    private modalService: ModalService,
    private auth: AuthService,
    private router: Router
  ) {}

  onSwitchModal() {
    this.modalService.closeAll();
    setTimeout(() => this.modalService.openRegisterModal(), 200);
  }

  async onLogin(formData: LoginFormValues) {
    try {
      this.isLoading = true;

      await this.auth.login(formData.email, formData.password);

      // this.modalComponent.resetForm();
      this.modalService.closeAll();
      this.router.navigate(["/about"]); //!Change to /articles when that page is ready
    } catch (error: any) {
      this.serverErrorMessage = this.firebaseErrorMessagesMap[error.code];
    } finally {
      this.isLoading = false;
    }
  }
}

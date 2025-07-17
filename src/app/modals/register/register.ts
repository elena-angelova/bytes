import { Component, ViewChild } from "@angular/core";
import { FormFieldConfig, RegisterFormValues } from "../../types";
import { formFields } from "../../config/form-fields.config";
import { ModalComponent } from "../../ui/modal/modal";
import { ModalService } from "../../services/modal.service";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  imports: [ModalComponent],
  templateUrl: "./register.html",
  styleUrl: "./register.css",
})
export class RegisterModalComponent {
  mode: string = "register";
  title: string = "Create an account";
  btnText: string = "Sign up";
  fieldLayout: string = "row-layout";
  isLoading: boolean = false;

  fields: FormFieldConfig = {
    firstName: formFields["firstName"],
    lastName: formFields["lastName"],
    email: formFields["email"],
    password: formFields["password"],
    repeatPassword: formFields["repeatPassword"],
    acceptTerms: formFields["acceptTerms"],
  };

  firebaseErrorMessagesMap: Record<string, string> = {
    "auth/email-already-in-use": "An account with this email already exists.",
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
    setTimeout(() => this.modalService.openLoginModal(), 200);
  }

  async onRegister(formData: RegisterFormValues) {
    try {
      this.isLoading = true;

      await this.auth.register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );

      this.modalComponent.resetForm();
      this.modalService.closeAll();
      this.router.navigate(["/about"]); //!Change to /articles when that page is ready
    } catch (error: any) {
      this.serverErrorMessage = this.firebaseErrorMessagesMap[error.code];
    } finally {
      this.isLoading = false;
    }
  }
}

// !The access token is valid for 1 hour only, so you need to create some logic to handle that - either request a new access token with the refresh token, or prompt the user to log in again.

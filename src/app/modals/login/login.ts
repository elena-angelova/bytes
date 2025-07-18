import { Component, inject, ViewChild } from "@angular/core";
import { ErrorMessages, FormFieldConfig, LoginFormValues } from "../../types";
import { formFields } from "../../config/form-fields.config";
import { ModalComponent } from "../../ui/modal/modal";
import { ModalService } from "../../services/modal.service";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-login",
  imports: [ModalComponent],
  templateUrl: "./login.html",
  styleUrl: "./login.css",
})
export class LoginModalComponent {
  title: string = "Log in";
  btnText: string = "Log in";
  fieldLayout: string = "column-layout";
  serverErrorMessage!: string;
  isLoading: boolean = false;
  isFormInvalid: boolean = false;
  errorMessages: string[] = [];

  fields: FormFieldConfig = {
    email: formFields["email"],
    password: formFields["password"],
  };

  private formBuilder = inject(FormBuilder);
  loginForm: FormGroup = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]],
  });

  firebaseErrorMessagesMap: Record<string, string> = {
    "auth/invalid-credential":
      "Your login information is incorrect. Please try again.",
    "auth/internal-error": "Something went wrong. Please try again.",
    "auth/network-request-failed":
      "Network error. Please check your internet connection.",
  };

  constructor(
    private modalService: ModalService,
    private auth: AuthService,
    private router: Router
  ) {}

  onSwitchModal() {
    this.modalService.closeAll();
    setTimeout(() => this.modalService.openRegisterModal(), 200);
  }

  onFormSubmit(): void {
    this.errorMessages = [];
    const formErrors: { [key: string]: ValidationErrors } = {};

    if (this.loginForm.valid) {
      this.isFormInvalid = false;
      this.onLogin(this.loginForm.value);
    } else {
      this.isFormInvalid = true;
      this.loginForm.markAllAsTouched();

      Object.keys(this.loginForm.controls).forEach((key: string) => {
        const controlErrors: ValidationErrors | null | undefined =
          this.loginForm.get(key)?.errors;
        if (controlErrors) {
          formErrors[key] = controlErrors;
        }
      });

      for (const field in formErrors) {
        const failedValidatorsObj: ValidationErrors = formErrors[field];
        const uiErrorMessages: ErrorMessages = this.fields[field].errorMessages;
        const failedValidator: string = Object.keys(failedValidatorsObj)[0];

        this.errorMessages.push(uiErrorMessages[failedValidator]);
      }
    }
  }

  async onLogin(formData: LoginFormValues) {
    try {
      this.isLoading = true;

      await this.auth.login(formData.email, formData.password);

      this.loginForm.reset();
      this.modalService.closeAll();

      await this.router.navigate(["/about"]); //!Change to /articles when that page is ready
    } catch (error: any) {
      this.serverErrorMessage =
        this.firebaseErrorMessagesMap[error.code] ||
        "An unexpected error occurred. Please try again.";
    } finally {
      this.isLoading = false;
    }
  }
}

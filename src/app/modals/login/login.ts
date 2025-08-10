import { Component, inject } from "@angular/core";
import { ErrorMessages, FormFields, LoginFormValues } from "../../types";
import { firebaseErrorMessages, formFields } from "../../config";
import { ModalComponent } from "../../shared/modal/modal";
import { ModalService } from "../../services/modal.service";
import { AuthService } from "../../services/auth.service";
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { ErrorService } from "../../services/error.service";

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

  // Get the necessary fields from the field config object
  fields: FormFields = {
    email: formFields["email"],
    password: formFields["password"],
  };

  // Build the form and add validators
  private formBuilder = inject(FormBuilder);
  loginForm: FormGroup = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]],
  });

  constructor(
    private modalService: ModalService,
    private auth: AuthService,
    private errorService: ErrorService
  ) {}

  // Switch to register modal
  onSwitchModal() {
    this.modalService.closeAll();
    setTimeout(() => this.modalService.openRegisterModal(), 200);
  }

  onFormSubmit(): void {
    this.errorMessages = [];
    const formErrors: { [key: string]: ValidationErrors } = {};

    // Check if form is valid
    if (this.loginForm.valid) {
      this.isFormInvalid = false;
      this.onLogin(this.loginForm.value);
    } else {
      this.isFormInvalid = true;
      this.loginForm.markAllAsTouched();

      // Collect validation errors from each form control
      Object.keys(this.loginForm.controls).forEach((key: string) => {
        const controlErrors: ValidationErrors | null | undefined =
          this.loginForm.get(key)?.errors;
        if (controlErrors) {
          formErrors[key] = controlErrors;
        }
      });

      // Map each validation error to a user-friendly message
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
    } catch (error: any) {
      this.errorService.handleError(this, error.code, firebaseErrorMessages);
    } finally {
      this.isLoading = false;
    }
  }
}

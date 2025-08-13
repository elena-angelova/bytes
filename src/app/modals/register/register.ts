import { Component, inject } from "@angular/core";
import { ErrorMessages, FormFields, RegisterFormValues } from "../../types";
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
  selector: "app-register",
  imports: [ModalComponent],
  templateUrl: "./register.html",
  styleUrl: "./register.css",
})
export class RegisterModalComponent {
  title: string = "Create an account";
  btnText: string = "Sign up";
  fieldLayout: string = "row-layout";
  serverErrorMessage: string = "";
  isLoading: boolean = false;
  isFormInvalid: boolean = false;
  errorMessages: string[] = [];
  passwordPattern: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

  // Get the necessary fields from the field config object
  fields: FormFields = {
    firstName: formFields["firstName"],
    lastName: formFields["lastName"],
    email: formFields["email"],
    password: formFields["password"],
    repeatPassword: formFields["repeatPassword"],
    acceptTerms: formFields["acceptTerms"],
  };

  // Build the form and add validators
  private formBuilder = inject(FormBuilder);
  registerForm: FormGroup = this.formBuilder.group(
    {
      firstName: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(this.passwordPattern),
        ],
      ],
      repeatPassword: ["", [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]],
    },
    {
      validators: this.passwordMatchValidator,
    }
  );

  constructor(
    private auth: AuthService,
    private modalService: ModalService,
    private errorService: ErrorService
  ) {}

  // Custom validator to check if "password" and "repeatPassword" fields match
  passwordMatchValidator(group: FormGroup) {
    const password: string = group.get("password")?.value;
    const repeatPassword: string = group.get("repeatPassword")?.value;
    return password === repeatPassword ? null : { passwordMismatch: true };
  }

  // Switch to login modal
  onSwitchModal() {
    this.modalService.closeAll();
    setTimeout(() => this.modalService.openLoginModal(), 200);
  }

  onFormSubmit(): void {
    this.serverErrorMessage = "";
    this.errorMessages = [];
    const formErrors: Record<string, ValidationErrors> = {};

    // Check if form is valid
    if (this.registerForm.valid) {
      this.isFormInvalid = false;
      this.onRegister(this.registerForm.value);
    } else {
      this.isFormInvalid = true;
      this.registerForm.markAllAsTouched();

      // Collect validation errors from each form control
      Object.keys(this.registerForm.controls).forEach((key: string) => {
        const controlErrors: ValidationErrors | null | undefined =
          this.registerForm.get(key)?.errors;
        if (controlErrors) {
          formErrors[key] = controlErrors;
        }
      });

      // Collect validation errors from the custom password match validator
      if (this.registerForm.errors) {
        formErrors["repeatPassword"] = this.registerForm.errors;
      }

      // Map each validation error to a user-friendly message
      for (const field in formErrors) {
        const failedValidatorsObj: ValidationErrors = formErrors[field];
        const uiErrorMessages: ErrorMessages = this.fields[field].errorMessages;
        const failedValidator: string = Object.keys(failedValidatorsObj)[0];

        this.errorMessages.push(uiErrorMessages[failedValidator]);
      }
    }
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

      this.registerForm.reset();
      this.modalService.closeAll();
    } catch (error: any) {
      this.errorService.handleError(this, error.code, firebaseErrorMessages);
    } finally {
      this.isLoading = false;
    }
  }
}

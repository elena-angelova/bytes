import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  ErrorMessages,
  FormAttributes,
  FormFieldConfig,
  LoginFormValues,
  RegisterFormValues,
} from "../../types";
import { PrimaryButtonComponent } from "../buttons/primary-button/primary-button";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
} from "@angular/forms";
import { ErrorMessageComponent } from "../error-message/error-message";

@Component({
  selector: "app-modal",
  imports: [ReactiveFormsModule, PrimaryButtonComponent, ErrorMessageComponent],
  templateUrl: "./modal.html",
  styleUrl: "./modal.css",
})
export class ModalComponent implements OnInit {
  @Input() mode!: string;
  @Input() title!: string;
  @Input() btnText!: string;
  @Input() fields!: FormFieldConfig;
  @Input() fieldLayout!: string;
  @Input() isLoading: boolean = false;
  @Input() serverErrorMessage!: string;

  @Output() switchToLoginModal = new EventEmitter<void>();
  @Output() switchToRegisterModal = new EventEmitter<void>();
  @Output() register = new EventEmitter<RegisterFormValues>();
  @Output() login = new EventEmitter<LoginFormValues>();

  fieldsArr!: [string, FormAttributes][];
  form!: FormGroup;
  passwordPattern: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
  isFormInvalid: boolean = false;
  errorMessages: { [key: string]: ErrorMessages } = {};
  failedValidators!: { [key: string]: ValidationErrors };

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.fieldsArr = Object.entries(this.fields);
    const group: { [key: string]: unknown } = {};

    for (const [key, config] of this.fieldsArr) {
      this.errorMessages[key] = config.errorMessages;

      const validators = [];

      if (config.required && key !== "acceptTerms") {
        validators.push(Validators.required);
      }

      switch (key) {
        case "firstName":
        case "lastName":
          validators.push(Validators.minLength(2));
          break;
        case "email":
          validators.push(Validators.email);
          break;
        case "password":
          if (this.mode === "register") {
            validators.push(Validators.minLength(8));
            validators.push(Validators.pattern(this.passwordPattern));
          }
          break;
        case "acceptTerms":
          validators.push(Validators.requiredTrue);
          break;
      }

      group[key] =
        key === "acceptTerms" ? [false, validators] : ["", validators];
    }

    if (this.mode === "register") {
      this.form = this.formBuilder.group(group, {
        validators: this.passwordMatchValidator,
      });
    } else {
      this.form = this.formBuilder.group(group);
    }
  }

  passwordMatchValidator(group: FormGroup) {
    const password: string = group.get("password")?.value;
    const repeatPassword: string = group.get("repeatPassword")?.value;
    return password === repeatPassword ? null : { passwordMismatch: true };
  }

  switchToLogin(): void {
    this.switchToLoginModal.emit();
  }

  switchToRegister(): void {
    this.switchToRegisterModal.emit();
  }

  onSubmit(): void {
    const failedValidators: { [key: string]: ValidationErrors } = {};

    if (this.form.valid) {
      this.isFormInvalid = false;

      if (this.mode === "login") {
        this.login.emit(this.form.value);
      } else if (this.mode === "register") {
        this.register.emit(this.form.value);
      }
    } else {
      this.isFormInvalid = true;
      this.form.markAllAsTouched();

      Object.keys(this.form.controls).forEach((key: string) => {
        const controlErrors: ValidationErrors | null | undefined =
          this.form.get(key)?.errors;
        if (controlErrors) {
          failedValidators[key] = controlErrors;
        }
      });

      if (this.form.errors) {
        failedValidators["repeatPassword"] = this.form.errors;
      }

      this.failedValidators = failedValidators;
    }
  }

  resetForm(): void {
    this.form.reset();
  }
}

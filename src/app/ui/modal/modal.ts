import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
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
} from "@angular/forms";

@Component({
  selector: "app-modal",
  imports: [ReactiveFormsModule, PrimaryButtonComponent],
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

  @Output() switchToLoginModal = new EventEmitter<void>();
  @Output() switchToRegisterModal = new EventEmitter<void>();
  @Output() register = new EventEmitter<RegisterFormValues>();
  @Output() login = new EventEmitter<LoginFormValues>();

  fieldsArr!: [string, FormAttributes][];
  form!: FormGroup;
  passwordPattern: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.fieldsArr = Object.entries(this.fields);
    const group: { [key: string]: unknown } = {};

    for (const [key, config] of this.fieldsArr) {
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
          validators.push(Validators.minLength(8));
          validators.push(Validators.pattern(this.passwordPattern));
          break;
        case "acceptTerms":
          validators.push(Validators.requiredTrue);
          break;
      }

      group[key] =
        key === "acceptTerms" ? [false, validators] : ["", validators];
    }

    this.form = this.formBuilder.group(group, {
      validators: this.passwordMatchValidator,
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get("password")?.value;
    const repeatPassword = group.get("repeatPassword")?.value;
    return password === repeatPassword ? null : { passwordMismatch: true };
  }

  switchToLogin(): void {
    this.switchToLoginModal.emit();
  }

  switchToRegister(): void {
    this.switchToRegisterModal.emit();
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.mode === "login") {
        this.login.emit(this.form.value);
      } else if (this.mode === "register") {
        this.register.emit(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  resetForm(): void {
    this.form.reset();
  }
}

// -------

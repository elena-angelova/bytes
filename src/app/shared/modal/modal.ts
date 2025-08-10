import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormFields } from "../../types";
import { PrimaryButtonComponent } from "../buttons/primary-button/primary-button";
import { ReactiveFormsModule, FormGroup } from "@angular/forms";
import { ErrorMessageComponent } from "../error-message/error-message";
import { KeyValuePipe } from "@angular/common";
import { SecondaryButtonComponent } from "../buttons/secondary-button/secondary-button";

@Component({
  selector: "app-modal",
  imports: [
    ReactiveFormsModule,
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    ErrorMessageComponent,
    KeyValuePipe,
  ],
  templateUrl: "./modal.html",
  styleUrl: "./modal.css",
})
export class ModalComponent {
  @Input() title!: string;
  @Input() btnText!: string;
  @Input() isLoading: boolean = false;

  @Input() confirmationMessage?: string;

  @Input() form?: FormGroup;
  @Input() fields?: FormFields;
  @Input() fieldLayout?: string;

  @Input() errorMessages: string[] = [];
  @Input() serverErrorMessage!: string;

  @Output() submit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  // Comparator for the keyvalue pipe to preserve the original order of the 'fields' object keys (disable sorting)
  preserveOrder = () => 0;
}

import { Component, Input, OnInit } from "@angular/core";
import { ErrorMessages } from "../../types";
import { ValidationErrors } from "@angular/forms";

@Component({
  selector: "app-error-message",
  imports: [],
  templateUrl: "./error-message.html",
  styleUrl: "./error-message.css",
})
export class ErrorMessageComponent {
  @Input() serverErrorMessage!: string;
  @Input() errorMessages!: { [key: string]: ErrorMessages };
  @Input() failedValidators!: { [key: string]: ValidationErrors } | undefined;
  failedValidatorsArr: [string, ValidationErrors][] = [];
  errors: string[] = [];

  ngOnChanges(): void {
    if (this.failedValidators) {
      const errors: string[] = [];
      this.failedValidatorsArr = Object.entries(this.failedValidators);

      for (const [field, validator] of this.failedValidatorsArr) {
        console.log(field);
        console.log(this.errorMessages[field]);

        const fieldErrorMessages: ErrorMessages = this.errorMessages[field];
        const failedValidator: string = Object.keys(validator)[0];
        errors.push(fieldErrorMessages[failedValidator]);
      }

      this.errors = errors;
    } else {
      this.errors.push(this.serverErrorMessage);
      console.log(this.errors);
    }
  }
}

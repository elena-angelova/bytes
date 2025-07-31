import { Component, Input } from "@angular/core";

@Component({
  selector: "app-error-message",
  imports: [],
  templateUrl: "./error-message.html",
  styleUrl: "./error-message.css",
})
export class ErrorMessageComponent {
  @Input() errorMessages: string[] = [];
  @Input() serverErrorMessage!: string;

  get errors(): string[] {
    if (this.errorMessages.length > 0) {
      return this.errorMessages;
    }

    if (this.serverErrorMessage) {
      return [this.serverErrorMessage];
    }

    return [];
  }
}

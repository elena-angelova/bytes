import { Component, Input } from "@angular/core";

@Component({
  selector: "app-error-message",
  imports: [],
  templateUrl: "./modal-error.html",
  styleUrl: "./modal-error.css",
})
export class ModalErrorComponent {
  @Input() errorMessages: string[] = [];
  @Input() serverErrorMessage: string = "";

  // Getter to return the validation or server error messages
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

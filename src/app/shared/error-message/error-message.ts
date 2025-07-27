import { Component, Input } from "@angular/core";

@Component({
  selector: "app-error-message",
  imports: [],
  templateUrl: "./error-message.html",
  styleUrl: "./error-message.css",
})
export class ErrorMessageComponent {
  @Input() serverErrorMessage!: string;
  @Input() errorMessages: string[] = [];

  errors!: string[];

  ngOnChanges(): void {
    this.errors = [];

    if (this.errorMessages.length > 0) {
      this.errorMessages.forEach((message) => {
        this.errors.push(message);
      });
    } else if (this.serverErrorMessage) {
      this.errors.push(this.serverErrorMessage);
    }
  }
}

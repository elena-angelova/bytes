import { Component, Input } from "@angular/core";

@Component({
  selector: "app-primary-button",
  imports: [],
  templateUrl: "./primary-button.html",
  styleUrl: "./primary-button.css",
})
export class PrimaryButtonComponent {
  @Input() btnText!: string;
}

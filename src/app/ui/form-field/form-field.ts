import { Component, input, Input } from "@angular/core";
import { FormAttributes } from "../../types";

@Component({
  selector: "app-form-field",
  imports: [],
  templateUrl: "./form-field.html",
  styleUrl: "./form-field.css",
})
export class FormFieldComponent {
  @Input() field!: FormAttributes;
}

import { Component } from "@angular/core";
import { formFields } from "../../config/form-fields.config";
import { FormFieldConfig } from "../../types";
import { ModalComponent } from "../../ui/modal/modal";

@Component({
  selector: "app-register",
  imports: [ModalComponent],
  templateUrl: "./register.html",
  styleUrl: "./register.css",
})
export class RegisterModalComponent {
  fields: FormFieldConfig = {
    firstName: formFields["firstName"],
    lastName: formFields["lastName"],
    email: formFields["email"],
    password: formFields["password"],
    repeatPassword: formFields["repeatPassword"],
  };
}

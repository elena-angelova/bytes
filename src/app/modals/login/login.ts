import { Component } from "@angular/core";
import { FormFieldConfig } from "../../types";
import { formFields } from "../../config/form-fields.config";
import { ModalComponent } from "../../ui/modal/modal";

@Component({
  selector: "app-login",
  imports: [ModalComponent],
  templateUrl: "./login.html",
  styleUrl: "./login.css",
})
export class LoginModalComponent {
  fields: FormFieldConfig = {
    email: formFields["email"],
    password: formFields["password"],
  };
}

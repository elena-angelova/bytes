import { Component } from "@angular/core";
import { FormFieldConfig } from "../../types";
import { formFields } from "../../config/form-fields.config";
import { ModalComponent } from "../../ui/modal/modal";
import { ModalService } from "../../services/modal.service";

@Component({
  selector: "app-login",
  imports: [ModalComponent],
  templateUrl: "./login.html",
  styleUrl: "./login.css",
})
export class LoginModalComponent {
  mode: string = "login";
  title: string = "Log in";
  btnText: string = "Log in";
  fieldLayout: string = "column-layout";

  fields: FormFieldConfig = {
    email: formFields["email"],
    password: formFields["password"],
  };

  constructor(private modalService: ModalService) {}

  onSwitchModal() {
    this.modalService.closeAll();
    setTimeout(() => this.modalService.openRegisterModal(), 200);
  }
}

import { Component, Input, OnInit } from "@angular/core";
import { FormAttributes, FormFieldConfig } from "../../types";
import { FormFieldComponent } from "../form-field/form-field";
import { PrimaryButtonComponent } from "../buttons/primary-button/primary-button";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-modal",
  imports: [RouterLink, FormFieldComponent, PrimaryButtonComponent],
  templateUrl: "./modal.html",
  styleUrl: "./modal.css",
})
export class ModalComponent implements OnInit {
  @Input() mode!: string;
  @Input() title!: string;
  @Input() btnText!: string;
  @Input() fields!: FormFieldConfig;
  @Input() layoutConfig!: string;
  formFieldsArr!: [string, FormAttributes][];

  ngOnInit(): void {
    this.formFieldsArr = Object.entries(this.fields);
  }
}

// export class ModalComponent implements AfterViewInit {
//   @ViewChild("modalContainer", { read: ViewContainerRef })
//   container!: ViewContainerRef;

//   ngAfterViewInit(): void {
//     this.container.clear();
//   }

//   open(component: Type<any>, data?: any) {
//     // !Adjust the correct types and remove any
//     this.container.clear();
//     const componentRef = this.container.createComponent(component);

//     if (data) {
//       Object.assign(componentRef.instance, data);
//     }
//   }
// }

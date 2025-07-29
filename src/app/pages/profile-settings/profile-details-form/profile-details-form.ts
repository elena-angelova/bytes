import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CtaButtonComponent } from "../../../shared/buttons/cta-button/cta-button";
import { UserUpdate } from "../../../types";

@Component({
  selector: "app-profile-details-form",
  imports: [ReactiveFormsModule, CtaButtonComponent],
  templateUrl: "./profile-details-form.html",
  styleUrl: "./profile-details-form.css",
})
export class ProfileDetailsFormComponent {
  @Input() form!: FormGroup;
  @Input() bio!: string | null;
  @Input() currentRole!: string | null;
  @Input() techStack!: string | null;
  @Input() isEditing!: boolean;

  @Output() submit = new EventEmitter<UserUpdate>();

  onEdit() {
    this.isEditing = true;
  }

  onCancel() {
    this.isEditing = false;
  }

  onSubmit() {
    this.submit.emit(this.form.value);
    this.isEditing = false;
  }
}

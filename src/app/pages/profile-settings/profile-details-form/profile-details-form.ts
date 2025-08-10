import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CtaButtonComponent } from "../../../shared/buttons/cta-button/cta-button";
import { User } from "../../../types";

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
  @Input() isLoading!: boolean;

  @Output() submit = new EventEmitter<Partial<User>>();
  @Output() editingChange = new EventEmitter<boolean>();

  // Enable editing mode and notify parent
  onEdit(): void {
    this.isEditing = true;
    this.editingChange.emit(this.isEditing);
  }

  // Disable editing mode and notify parent
  onCancel(): void {
    this.isEditing = false;
    this.editingChange.emit(this.isEditing);
  }

  // Emit the form value to the parent for processing
  onSubmit(): void {
    this.submit.emit(this.form.value);
  }
}

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { CtaButtonComponent } from "../../../shared/buttons/cta-button/cta-button";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-article-header-form",
  imports: [ReactiveFormsModule, CtaButtonComponent],
  templateUrl: "./article-header-form.html",
  styleUrl: "./article-header-form.css",
})
export class ArticleHeaderFormComponent implements AfterViewInit {
  @Input() articleCategories!: string[];
  @Input() fileName!: string;
  @Input() previewFileUrl!: string;
  @Input() form!: FormGroup;
  @Input() isFormInvalid!: boolean;

  @Output() submit = new EventEmitter<void>();
  @Output() fileSelected = new EventEmitter<File>();

  @ViewChild("titleTextarea") textarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild("popUp") popUp!: ElementRef<HTMLSpanElement>;

  ngAfterViewInit(): void {
    this.textarea.nativeElement.focus();
    this.resizeTitleField();
  }

  resizeTitleField() {
    const el = this.textarea.nativeElement;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  @HostListener("window:resize")
  onWindowResize() {
    this.resizeTitleField();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file: File | undefined = input.files?.[0];

    if (file) {
      this.fileSelected.emit(file);
    }
  }

  onSubmit() {
    if (this.isFormInvalid) {
      const el = this.popUp.nativeElement;
      el.classList.remove("fade");
      void el.offsetWidth;
      el.classList.add("fade");
    }

    this.submit.emit();
  }
}

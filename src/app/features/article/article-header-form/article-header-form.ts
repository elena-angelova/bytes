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
  @Input() isLoading!: boolean;

  @Output() submit = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() fileSelected = new EventEmitter<File>();

  @ViewChild("titleTextarea") textarea!: ElementRef<HTMLTextAreaElement>;

  ngAfterViewInit(): void {
    this.textarea.nativeElement.focus();
    this.resizeTitleField();
  }

  @HostListener("window:resize")
  onWindowResize() {
    this.resizeTitleField();
  }

  resizeTitleField() {
    const el = this.textarea.nativeElement;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  onFileSelected(event: Event) {
    const inputEl = event.target as HTMLInputElement;
    const file: File | undefined = inputEl.files?.[0];

    if (file) {
      this.fileSelected.emit(file);
    }
  }
}

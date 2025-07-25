import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { CtaButtonComponent } from "../../../ui/buttons/cta-button/cta-button";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-article-meta",
  imports: [ReactiveFormsModule, CtaButtonComponent],
  templateUrl: "./article-meta.html",
  styleUrl: "./article-meta.css",
})
export class ArticleMetaComponent implements AfterViewInit {
  @Input() articleCategories!: string[];
  @Input() fileName!: string;
  @Input() form!: FormGroup;
  @Input() isFormInvalid!: boolean;

  @Output() submit = new EventEmitter<void>();
  @Output() fileSelected = new EventEmitter<File>();

  @ViewChild("titleTextarea") textarea!: ElementRef<HTMLTextAreaElement>;

  // *Consider moving this logic to the ArticleEditorComponent
  @ViewChild("popUp") popUp!: ElementRef<HTMLSpanElement>;

  ngAfterViewInit(): void {
    this.textarea.nativeElement.focus();
    this.resizeTitleField();
  }

  // !The field doesn't resize when the viewport width is changed - see how you can fix that
  resizeTitleField() {
    const el = this.textarea.nativeElement;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file: File | undefined = input.files?.[0];

    if (file) {
      this.fileName = file.name;
      this.fileSelected.emit(file);
    }
  }

  // *

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

import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import Quill from "quill";

@Component({
  selector: "app-text-editor",
  imports: [ReactiveFormsModule],
  templateUrl: "./text-editor.html",
  styleUrl: "./text-editor.css",
})
export class TextEditorComponent {
  @Input() form!: FormGroup;
  @Output() getRawHTML = new EventEmitter<string>();
  @ViewChild("editor", { static: true }) editorContainer!: ElementRef;

  quill!: Quill;

  ngAfterViewInit() {
    this.quill = new Quill(this.editorContainer.nativeElement, {
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          ["link", "blockquote", "code-block"],
          ["code"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["clean"],
        ],
      },
      theme: "snow",
      placeholder: "Tell your story...",
    });

    const initialContent = this.form.get("content")?.value;
    if (initialContent) {
      this.quill.setContents(this.quill.clipboard.convert(initialContent));
    }

    this.quill.on("text-change", () => {
      this.getRawHTML.emit(this.quill.root.innerHTML); // *This emits events every time the input changes which isn't efficient. Think how you can be sure the user has finished editing and wants to publish (by clicking the Publish button) and how you can get the quill editor to that function (in ArticleMetaComponent)

      const textContent = this.quill.getText().trim();
      this.form.get("content")?.setValue(textContent);
    });
  }
}

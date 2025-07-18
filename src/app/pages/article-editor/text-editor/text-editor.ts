import { Component, ElementRef, ViewChild } from "@angular/core";
import Quill from "quill";

@Component({
  selector: "app-text-editor",
  imports: [],
  templateUrl: "./text-editor.html",
  styleUrl: "./text-editor.css",
})
export class TextEditorComponent {
  @ViewChild("editor", { static: true })
  editorContainer!: ElementRef;

  quill!: Quill;
  content: string = "";

  ngAfterViewInit() {
    this.quill = new Quill(this.editorContainer.nativeElement, {
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          ["link", "blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["clean"],
        ],
      },
      theme: "snow",
      placeholder: "Tell your story...",
    });

    this.quill.on("text-change", () => {
      this.content = this.quill.root.innerHTML;
    });
  }
}

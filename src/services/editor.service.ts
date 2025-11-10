import type { Editor } from "obsidian";

export interface IEditorService {
  getSelection(): string;
  replaceSelection(replacement: string, origin?: string): void;
}

export class EditorService implements IEditorService {
  private editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  getSelection(): string {
    return this.editor.getSelection();
  }

  replaceSelection(replacement: string, origin?: string): void {
    this.editor.replaceSelection(replacement, origin);
  }
}

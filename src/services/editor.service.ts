import type { Editor } from "obsidian";
import { inject, singleton } from "tsyringe";

export interface IEditorService {
  getSelection(): string;
  replaceSelection(replacement: string, origin?: string): void;
}

@singleton()
export class EditorService implements IEditorService {
  constructor(@inject("Editor") private readonly editor: Editor) {}

  getSelection(): string {
    return this.editor.getSelection();
  }

  replaceSelection(replacement: string, origin?: string): void {
    this.editor.replaceSelection(replacement, origin);
  }
}

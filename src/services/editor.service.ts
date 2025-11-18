import type { Editor } from "obsidian";
import { inject, injectable } from "tsyringe";

export interface IEditorService {
  getSelection(): string;
  replaceSelection(replacement: string, origin?: string): void;
}

@injectable()
export class EditorService implements IEditorService {
  constructor(@inject("Editor") private readonly editor: Editor) {}

  getSelection(): string {
    return this.editor.getSelection();
  }

  replaceSelection(replacement: string, origin?: string): void {
    this.editor.replaceSelection(replacement, origin);
  }
}

import { MarkdownView, type TFile, type Workspace } from "obsidian";
import { inject, singleton } from "tsyringe";

export interface IWorkspaceService {
  getActiveFile(): TFile | null;
  isReadingMode(): boolean;
}

@singleton()
export class WorkspaceService implements IWorkspaceService {
  constructor(@inject("Workspace") private readonly workspace: Workspace) {}

  getActiveFile(): TFile | null {
    return this.workspace.getActiveFile();
  }

  isReadingMode(): boolean {
    return this.workspace.getActiveViewOfType(MarkdownView)?.getMode() === "preview";
  }
}

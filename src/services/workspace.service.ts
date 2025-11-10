import { MarkdownView, type TFile, type Workspace } from "obsidian";

export interface IWorkspaceService {
  getActiveFile(): TFile | null;
  isReadingMode(): boolean;
}

export class WorkspaceService implements IWorkspaceService {
  private workspace: Workspace;

  constructor(workspace: Workspace) {
    this.workspace = workspace;
  }

  getActiveFile(): TFile | null {
    return this.workspace.getActiveFile();
  }

  isReadingMode(): boolean {
    return (
      this.workspace.getActiveViewOfType(MarkdownView)?.getMode() === "preview"
    );
  }
}

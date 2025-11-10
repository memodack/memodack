import { Notice } from "obsidian";

import type { BlitzModalService } from "./blitz-modal.service";
import type { IPart, IPartsService } from "./parts.service";
import type { IWorkspaceService } from "./workspace.service";

export interface IRibbonIconService {
  getCallback: () => Promise<void>;
}

const svg = `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13 2 4.093 12.688c-.348.418-.523.628-.525.804a.5.5 0 0 0 .185.397c.138.111.41.111.955.111H12l-1 8 8.907-10.688c.348-.418.523-.628.525-.804a.5.5 0 0 0-.185-.397c-.138-.111-.41-.111-.955-.111H12z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

export class RibbonIconService implements IRibbonIconService {
  static readonly id = "memodack";
  static readonly title = "Memodack";
  static readonly svg = svg;

  private workspaceService: IWorkspaceService;
  private partsService: IPartsService;
  private blitzModalService: BlitzModalService;

  constructor(
    workspaceService: IWorkspaceService,
    partsService: IPartsService,
    blitzModalService: BlitzModalService,
  ) {
    this.workspaceService = workspaceService;
    this.partsService = partsService;
    this.blitzModalService = blitzModalService;
  }

  getCallback = async (): Promise<void> => {
    const isReadingMode = this.workspaceService.isReadingMode();

    if (!isReadingMode) {
      new Notice("Only in Reading Mode.");
      return;
    }

    let parts: IPart[] = [];

    parts = this.partsService.getSelectedParts();

    if (!parts.length) {
      parts = await this.partsService.getParts();
    }

    if (!parts.length) {
      new Notice("No parts provided.");
      return;
    }

    if (parts.length < 4) {
      new Notice("At least 4 parts required.");
      return;
    }

    this.blitzModalService.setParts(parts);
    this.blitzModalService.open();
  };
}

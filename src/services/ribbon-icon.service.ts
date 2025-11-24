import { Notice } from "obsidian";
import { inject, singleton } from "tsyringe";
import type { IPracticeModalService } from "../practice/practice-modal.service";
import type { IQuestsService } from "../practice/quests.service";
import type { IWord } from "../types";
import type { IPart, IPartsService } from "./parts.service";
import type { IWorkspaceService } from "./workspace.service";

export interface IRibbonIconService {
  getIcon(): string;
  getCallback: () => Promise<void>;
}

const svg = `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13 2 4.093 12.688c-.348.418-.523.628-.525.804a.5.5 0 0 0 .185.397c.138.111.41.111.955.111H12l-1 8 8.907-10.688c.348-.418.523-.628.525-.804a.5.5 0 0 0-.185-.397c-.138-.111-.41-.111-.955-.111H12z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

@singleton()
export class RibbonIconService implements IRibbonIconService {
  constructor(
    @inject("IWorkspaceService")
    private readonly workspaceService: IWorkspaceService,
    @inject("IPartsService") private readonly partsService: IPartsService,
    @inject("IPracticeModalService")
    private readonly practiceModalService: IPracticeModalService,
    @inject("IQuestsService")
    private readonly questsService: IQuestsService,
  ) {}

  getIcon(): string {
    return svg;
  }

  getCallback = async (): Promise<void> => {
    const isReadingMode = this.workspaceService.isReadingMode();

    if (!isReadingMode) {
      new Notice("Only in Reading Mode.");
      return;
    }

    let parts: IPart[] = [];

    parts = await this.partsService.getSelectedParts();

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

    const words: IWord[] = parts.map((p) => ({
      value: p.value,
      translation: p.translation,
      text: p?.text || null,
      imageUrl: p?.imageUrl || null,
    }));

    this.questsService.createQuests(words);
    this.practiceModalService.open();
  };
}

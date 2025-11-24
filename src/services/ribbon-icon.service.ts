import { Notice } from "obsidian";
import { inject, singleton } from "tsyringe";
import type { IPracticeModalService } from "../practice/practice-modal.service";
import type { IQuestsService } from "../practice/quests.service";
import type { IWord } from "../types";
import type { IWordsService } from "./words.service";
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
    @inject("IWordsService") private readonly wordsService: IWordsService,
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

    let words: IWord[] = [];

    words = await this.wordsService.getSelectedWords();

    if (!words.length) {
      words = await this.wordsService.getWords();
    }

    if (!words.length) {
      new Notice("No words provided.");
      return;
    }

    if (words.length < 4) {
      new Notice("At least 4 words required.");
      return;
    }

    this.questsService.createQuests(words);
    this.practiceModalService.open();
  };
}

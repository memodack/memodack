import { TFile } from "obsidian";
import { inject, singleton } from "tsyringe";
import type { IWord } from "../types";
import type { IVaultService } from "./vault.service";
import type { IWorkspaceService } from "./workspace.service";

export interface IWordsService {
  getWords(): Promise<IWord[]>;
  getSelectedWords(): Promise<IWord[]>;
}

interface IExternalLink {
  title: string;
  url: string;
}

@singleton()
export class WordsService implements IWordsService {
  constructor(
    @inject("IVaultService") private readonly vaultService: IVaultService,
    @inject("IWorkspaceService")
    private readonly workspaceService: IWorkspaceService,
  ) {}

  async getWords(): Promise<IWord[]> {
    const activeFile = this.workspaceService.getActiveFile();

    if (!activeFile) {
      return [];
    }

    const content = await this.vaultService.read(activeFile);

    if (!content.length) {
      return [];
    }

    /**
     * {value|translation}
     */
    const matches = [...content.matchAll(/\{([^\\|{}]+)\|([^\\|{}]+)\}/g)];

    const words: IWord[] = [];

    const texts = content.split("\n");

    /**
     * Generate words array
     */
    matches.forEach((match) => {
      /**
       * Don't put duplicates to the array
       */
      if (words.find((item) => item.value === match[1])) {
        return;
      }

      const textIndex = texts.findIndex((item) => item.includes(`{${match[1]}|${match[2]}}`));

      let rawText = texts[textIndex].replaceAll(`{${match[1]}|${match[2]}}`, match[1]);

      const anotherWords = [...rawText.matchAll(/\{([^\\|{}]+)\|([^\\|{}]+)\}/g)];

      anotherWords.forEach((item) => {
        rawText = rawText.replace(item[0], item[1]);
      });

      const data: IWord = {
        value: match[1],
        translation: match[2],
        text: rawText,
        imageUrl: null,
      };

      /**
       * Image
       */
      const imageUrl = this.findAnImageUrl(content, match[1]);

      if (imageUrl) {
        data.imageUrl = imageUrl;
      }

      words.push(data);
    });

    return words;
  }

  async getSelectedWords(): Promise<IWord[]> {
    const activeFile = this.workspaceService.getActiveFile();

    if (!activeFile) {
      return [];
    }

    const content = await this.vaultService.read(activeFile);

    const words: IWord[] = [];

    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0 && selection.toString().length) {
      const ranges = selection.getRangeAt(0);
      const spans = document.querySelectorAll(".memodack___syntax");

      /**
       * Iterate over all <span> elements
       */
      spans.forEach((span) => {
        const spanRange = document.createRange();
        spanRange.selectNode(span);

        /**
         * Check if the selection intersects with the <span> element
         */
        if (ranges.intersectsNode(span)) {
          const value = span.textContent;

          if (!value) {
            return;
          }

          const translation = span.getAttribute("data-translation");

          /**
           * Format the string and add it to the array
           */
          if (value && translation) {
            const data: IWord = { value, translation, text: null, imageUrl: null };

            /**
             * Image
             */
            const imageUrl = this.findAnImageUrl(content, value);

            if (imageUrl) {
              data.imageUrl = imageUrl;
            }

            words.push(data);
          }
        }
      });

      /**
       * Clear selection
       */
      selection.removeAllRanges();

      return words;
    }

    return [];
  }

  private findAnImageUrl(content: string, search: string): string | null {
    const filteredImages = this.extractExternalLinks(content).map((item) => ({
      title: item.title,
      url: this.getResourcePath(item.url),
    }));

    const image = filteredImages.find((item) => item.title === search);

    if (!image) {
      return null;
    }

    return image.url;
  }

  private extractExternalLinks(content: string): IExternalLink[] {
    /**
     * [text](url)
     */
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;

    return [...content.matchAll(regex)].map((m) => ({
      title: m[1],
      url: m[2],
    }));
  }

  private getResourcePath(path: string) {
    let url = path;

    const file = this.vaultService.getAbstractFileByPath(url);

    if (file instanceof TFile) {
      url = this.vaultService.getResourcePath(file);
    }

    return url;
  }
}

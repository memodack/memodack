import { TFile } from "obsidian";
import { inject, singleton } from "tsyringe";
import type { IVaultService } from "./vault.service";
import type { IWorkspaceService } from "./workspace.service";

export interface IPart {
  value: string;
  translation: string;
  text?: string;
  imageUrl?: string;
}

export interface IPartsService {
  getParts(): Promise<IPart[]>;
  getSelectedParts(): Promise<IPart[]>;
}

interface IExternalLink {
  title: string;
  url: string;
}

@singleton()
export class PartsService implements IPartsService {
  constructor(
    @inject("IVaultService") private readonly vaultService: IVaultService,
    @inject("IWorkspaceService")
    private readonly workspaceService: IWorkspaceService,
  ) {}

  async getParts(): Promise<IPart[]> {
    const activeFile = this.workspaceService.getActiveFile();

    if (!activeFile) {
      return [];
    }

    const content = await this.vaultService.read(activeFile);

    if (!content.length) {
      return [];
    }

    const matches = [...content.matchAll(/\{([^\\|{}]+)\|([^\\|{}]+)\}/g)]; // {value|translation}

    const parts: IPart[] = [];

    const texts = content.split("\n");

    // Generate parts array
    matches.forEach((match) => {
      // Don't put duplicates to the array
      if (parts.find((item) => item.value === match[1])) {
        return;
      }

      const textIndex = texts.findIndex((item) => item.includes(`{${match[1]}|${match[2]}}`));

      let rawText = texts[textIndex].replaceAll(`{${match[1]}|${match[2]}}`, match[1]);

      const anotherParts = [...rawText.matchAll(/\{([^\\|{}]+)\|([^\\|{}]+)\}/g)];

      anotherParts.forEach((item) => {
        rawText = rawText.replace(item[0], item[1]);
      });

      const data: IPart = {
        value: match[1],
        translation: match[2],
        text: rawText,
      };

      /**
       * Image
       */
      const imageUrl = this.findAnImageUrl(content, match[1]);

      if (imageUrl) {
        data.imageUrl = imageUrl;
      }

      parts.push(data);
    });

    return parts;
  }

  async getSelectedParts(): Promise<IPart[]> {
    const activeFile = this.workspaceService.getActiveFile();

    if (!activeFile) {
      return [];
    }

    const content = await this.vaultService.read(activeFile);

    const parts: IPart[] = [];

    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0 && selection.toString().length) {
      const ranges = selection.getRangeAt(0);
      const spans = document.querySelectorAll(".memodack___syntax");

      // Iterate over all <span> elements
      spans.forEach((span) => {
        const spanRange = document.createRange();
        spanRange.selectNode(span);

        // Check if the selection intersects with the <span> element
        if (ranges.intersectsNode(span)) {
          const value = span.textContent;

          if (!value) {
            return;
          }

          const translation = span.getAttribute("data-translation");

          // Format the string and add it to the array
          if (value && translation) {
            const data: IPart = { value, translation };

            /**
             * Image
             */
            const imageUrl = this.findAnImageUrl(content, value);

            if (imageUrl) {
              data.imageUrl = imageUrl;
            }

            parts.push(data);
          }
        }
      });

      // Clear selection
      selection.removeAllRanges();

      return parts;
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
    // [text](url)
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

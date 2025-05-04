import { App } from 'obsidian';

export interface IPart {
  value: string;
  translation: string;
  text: string;
}

export interface IPartsService {
  getParts(): Promise<IPart[]>;
  getSelectedParts(): IPart[];
}

export class PartsService implements IPartsService {
  private app: App;

  constructor(app: App) {
    this.app = app;
  }

  async getParts(): Promise<IPart[]> {
    const activeFile = this.app.workspace.getActiveFile();

    if (!activeFile) {
      return [];
    }

    const content = await this.app.vault.read(activeFile);

    if (!content.length) {
      return [];
    }

    const matches = [...content.matchAll(/\{([^\\|{}]+)\|([^\\|{}]+)\}/g)]; // {value|translation}

    const parts: IPart[] = [];

    const texts = content.split('\n');

    // Generate parts array
    matches.forEach((match) => {
      // Don't put duplicates to the array
      if (parts.find((item) => item.value === match[1])) {
        return;
      }

      const textIndex = texts.findIndex((item) =>
        item.includes(`{${match[1]}|${match[2]}}`),
      );

      let rawText = texts[textIndex].replaceAll(
        `{${match[1]}|${match[2]}}`,
        match[1],
      );

      const anotherParts = [
        ...rawText.matchAll(/\{([^\\|{}]+)\|([^\\|{}]+)\}/g),
      ];

      anotherParts.forEach((item) => {
        rawText = rawText.replace(item[0], item[1]);
      });

      parts.push({
        value: match[1],
        translation: match[2],
        text: rawText,
      });
    });

    return parts;
  }

  getSelectedParts(): IPart[] {
    const activeFile = this.app.workspace.getActiveFile();

    if (!activeFile) {
      return [];
    }

    const parts: IPart[] = [];

    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0 && selection.toString().length) {
      const ranges = selection.getRangeAt(0);
      const spans = document.querySelectorAll('.memodack___syntax');

      // Iterate over all <span> elements
      spans.forEach((span) => {
        const spanRange = document.createRange();
        spanRange.selectNode(span);

        // Check if the selection intersects with the <span> element
        if (ranges.intersectsNode(span)) {
          const beforeText = span.previousSibling?.textContent?.trim() || '';
          const afterText = span.nextSibling?.textContent?.trim() || '';

          const value = span.textContent;

          if (!value) {
            return;
          }

          const translation = span.getAttribute('data-translation');

          const text = `${beforeText} ${value} ${afterText}`.trim();

          // Format the string and add it to the array
          if (value && translation) {
            parts.push({ value, translation, text });
          }
        }
      });

      // Clear selection
      selection.removeAllRanges();

      return parts;
    }

    return [];
  }
}

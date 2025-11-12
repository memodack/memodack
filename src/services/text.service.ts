import { injectable } from "tsyringe";

export type TTruncatePosition = "left" | "right";

export interface ITextService {
  truncate(text: string, position?: TTruncatePosition): string;
}

@injectable()
export class TextService implements ITextService {
  truncate(text: string, position: TTruncatePosition = "right"): string {
    if (!text) {
      return "";
    }

    const length = text.length;

    // if the word has 3 or fewer characters, return it unchanged
    if (length <= 3) {
      return text;
    }

    // always keep exactly 3 characters
    const keepLength = 3;

    if (position === "left") {
      return `...${text.slice(length - keepLength)}`;
    } else {
      return `${text.slice(0, keepLength)}...`;
    }
  }
}

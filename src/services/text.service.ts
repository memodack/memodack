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
    const deviation = Math.random() * 0.2 - 0.1;
    const cutRatio = 0.5 + deviation;
    const cutLength = Math.floor(length * cutRatio);

    if (position === "left") {
      return `...${text.slice(length - cutLength)}`;
    } else {
      return `${text.slice(0, cutLength)}...`;
    }
  }
}

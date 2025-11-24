import type { IQuest } from "../types";

export interface IQuestItem {
  getImageUrl(): string | null;
  getQuestion(): string;
  getHelpText(): string | null;
  getAnswers(): string[];
  checkAnswer(id: number): boolean;
  getTranslation(): string;
}

export class QuestItem implements IQuestItem {
  private imageUrl: string | null;
  private question!: string;
  private helpText: string | null;
  private answers!: string[];
  private correctAnswerId!: number;

  constructor(quest: IQuest) {
    this.imageUrl = quest.imageUrl;
    this.question = quest.question;
    this.helpText = quest.helpText;
    this.answers = quest.answers;
    this.correctAnswerId = quest.correctAnswerId;
  }

  getImageUrl(): string | null {
    return this.imageUrl || null;
  }

  getQuestion(): string {
    return this.question;
  }

  getHelpText(): string | null {
    return this.helpText || null;
  }

  getAnswers(): string[] {
    return this.answers;
  }

  getTranslation(): string {
    return this.answers[this.correctAnswerId];
  }

  checkAnswer(index: number): boolean {
    return this.correctAnswerId === index;
  }
}

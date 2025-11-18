import { inject, singleton } from "tsyringe";
import type { IPart } from "./parts.service";
import type { ISettingsService } from "./settings.service";

export interface IBlitz {
  correctAnswerId: number;
  question: string;
  answers: string[];
  text?: string;
  imageUrl?: string;
}

export interface IBlitzService {
  create(parts: IPart[]): void;
  getBlitz(id: number): IBlitz | null;
  repeatBlitz(id: number): void;
  getSize(): number;
  getProgress(): number;
}

@singleton()
export class BlitzService implements IBlitzService {
  private blitzMap = new Map<number, IBlitz>();
  private progress = 0;

  constructor(
    @inject("ISettingsService")
    private readonly settingsService: ISettingsService,
  ) {}

  create(parts: IPart[]): void {
    this.blitzMap.clear();

    this.resetProgress();

    const shuffleParts = this.shuffle(parts);

    shuffleParts.forEach((shufflePartItem, index) => {
      const [n1, n2, n3] = this.getRandomNumbers(shuffleParts.length, index, 3);

      const isTranslationDivider = this.settingsService.getTranslationDivider();

      const q1 = isTranslationDivider
        ? this.getRandomSegment(shufflePartItem.translation)
        : shufflePartItem.translation;
      const q2 = isTranslationDivider
        ? this.getRandomSegment(shuffleParts[n1].translation)
        : shuffleParts[n1].translation;
      const q3 = isTranslationDivider
        ? this.getRandomSegment(shuffleParts[n2].translation)
        : shuffleParts[n2].translation;
      const q4 = isTranslationDivider
        ? this.getRandomSegment(shuffleParts[n3].translation)
        : shuffleParts[n3].translation;

      const answers = [q1, q2, q3, q4];

      const shuffleAnswers = this.shuffle(answers);

      const correctAnswerId = shuffleAnswers.indexOf(q1);

      this.blitzMap.set(index, {
        correctAnswerId,
        question: shufflePartItem.value,
        answers: shuffleAnswers,
        text: shufflePartItem.text,
        imageUrl: shufflePartItem?.imageUrl,
      });
    });
  }

  getBlitz(id: number): IBlitz | null {
    const blitz = this.blitzMap.get(id);

    if (!blitz) {
      return null;
    }

    this.positiveProgress();

    return blitz;
  }

  repeatBlitz(id: number): void {
    const blitz = this.blitzMap.get(id);

    if (!blitz) {
      return;
    }

    this.negativeProgress();

    const shuffleAnswers = this.shuffle(blitz.answers);

    const blitzTranslation = blitz.answers[blitz.correctAnswerId];

    const correctAnswerId = shuffleAnswers.indexOf(blitzTranslation);

    this.blitzMap.set(this.blitzMap.size, {
      correctAnswerId,
      answers: shuffleAnswers,
      question: blitz.question,
      text: blitz.text,
    });
  }

  getSize(): number {
    return this.blitzMap.size;
  }

  getProgress(): number {
    return this.progress - 1;
  }

  private resetProgress(): void {
    this.progress = 0;
  }

  private positiveProgress(): void {
    this.progress += 1;
  }

  private negativeProgress(): void {
    this.progress -= 1;
  }

  private getRandomNumbers(maxNumber: number, ignoreNumber: number, count: number): number[] {
    if (maxNumber < 1 || count < 1) {
      throw new Error("The maxNumber must be greater than or equal to 1 and count must be greater than or equal to 1.");
    }

    const availableNumbers = new Set<number>();
    for (let i = 0; i < maxNumber; i++) {
      if (i !== ignoreNumber) {
        availableNumbers.add(i);
      }
    }

    if (availableNumbers.size < count) {
      throw new Error("Not enough unique numbers available to satisfy the count.");
    }

    const result: number[] = [];
    const availableArray = Array.from(availableNumbers);

    while (result.length < count) {
      const randomIndex = Math.floor(Math.random() * availableArray.length);
      const randomNumber = availableArray[randomIndex];
      result.push(randomNumber);
      availableArray.splice(randomIndex, 1);
    }

    return result;
  }

  /**
   * Shuffles the elements of an array using the Fisher-Yates algorithm.
   */
  private shuffle<T>(array: T[]): T[] {
    if (!Array.isArray(array)) {
      throw new Error("Input array cannot be null or undefined.");
    }

    // Create a copy of the array to avoid modifying the original
    const shuffled = [...array];

    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      // Swap elements
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  /**
   * Split the text to the parts and return randomly one of it.
   */
  private getRandomSegment(text: string, divider: string = ";"): string {
    const parts = text.split(divider).map((item) => item.trim());
    const index = Math.floor(Math.random() * parts.length);
    return parts[index];
  }
}

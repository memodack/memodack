import { singleton } from "tsyringe";

export interface IRandomService {
  shuffleArray<T>(array: T[]): T[];
  getSegment(text: string, divider?: string): string;
  getNumbers(maxNumber: number, ignoreNumber: number, count: number): number[];
}

@singleton()
export class RandomService implements IRandomService {
  shuffleArray<T>(array: T[]): T[] {
    if (!Array.isArray(array)) {
      throw new Error("Input array cannot be null or undefined.");
    }

    /**
     * Create a copy of the array to avoid modifying the original
     */
    const shuffled = [...array];

    /**
     * Fisher-Yates shuffle algorithm
     */
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      /**
       * Swap elements
       */
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  getSegment(text: string, divider: string = ";"): string {
    const items = text.split(divider).map((item) => item.trim());
    const index = Math.floor(Math.random() * items.length);
    return items[index];
  }

  getNumbers(maxNumber: number, ignoreNumber: number, count: number): number[] {
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
}

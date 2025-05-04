export interface IShuffleService {
  shuffle<T>(array: T[]): T[];
}

export class ShuffleService implements IShuffleService {
  /**
   * Shuffles the elements of an array using the Fisher-Yates algorithm.
   */
  shuffle<T>(array: T[]): T[] {
    if (!Array.isArray(array)) {
      throw new Error('Input array cannot be null or undefined.');
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
}

export const shuffleService = new ShuffleService();

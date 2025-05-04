export interface INumbersService {
  getRandomNumbers(
    maxNumber: number,
    ignoreNumber: number,
    count: number,
  ): number[];
}

export class NumbersService implements NumbersService {
  getRandomNumbers(
    maxNumber: number,
    ignoreNumber: number,
    count: number,
  ): number[] {
    if (maxNumber < 1 || count < 1) {
      throw new Error(
        'The maxNumber must be greater than or equal to 1 and count must be greater than or equal to 1.',
      );
    }

    const availableNumbers = new Set<number>();
    for (let i = 0; i < maxNumber; i++) {
      if (i !== ignoreNumber) {
        availableNumbers.add(i);
      }
    }

    if (availableNumbers.size < count) {
      throw new Error(
        'Not enough unique numbers available to satisfy the count.',
      );
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

export const numbersService = new NumbersService();

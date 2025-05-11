import { INumbersService, numbersService } from './numbers.service';
import { IShuffleService, shuffleService } from './shuffle.service';

import { IPart } from './parts.service';

export interface IBlitz {
  correctAnswerId: number;
  question: string;
  answers: string[];
  text: string;
}

export interface IBlitzService {
  create(parts: IPart[]): void;
  getBlitz(id: number): IBlitz | null;
  repeatBlitz(id: number): void;
  getSize(): number;
  getProgress(): number;
}

export class BlitzService implements IBlitzService {
  private blitzMap = new Map<number, IBlitz>();
  private shuffleService: IShuffleService;
  private numbersService: INumbersService;
  private progress = 0;

  constructor(
    shuffleService: IShuffleService,
    numbersService: INumbersService,
  ) {
    this.shuffleService = shuffleService;
    this.numbersService = numbersService;
  }

  create(parts: IPart[]): void {
    this.blitzMap.clear();

    this.resetProgress();

    const shuffleParts = this.shuffleService.shuffle(parts);

    shuffleParts.forEach((shufflePartItem, index) => {
      const [n1, n2, n3] = this.numbersService.getRandomNumbers(
        shuffleParts.length,
        index,
        3,
      );

      const q1 = shufflePartItem.translation;
      const q2 = shuffleParts[n1].translation;
      const q3 = shuffleParts[n2].translation;
      const q4 = shuffleParts[n3].translation;

      const answers = [q1, q2, q3, q4];

      const shuffleAnswers = this.shuffleService.shuffle(answers);

      const correctAnswerId = shuffleAnswers.findIndex(
        (shuffleAnswerItem) => shuffleAnswerItem === q1,
      );

      this.blitzMap.set(index, {
        correctAnswerId,
        question: shufflePartItem.value,
        answers: shuffleAnswers,
        text: shufflePartItem.text,
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

    const shuffleAnswers = this.shuffleService.shuffle(blitz.answers);

    const blitzTranslation = blitz.answers[blitz.correctAnswerId];

    const correctAnswerId = shuffleAnswers.findIndex(
      (shuffleAnswerItem) => shuffleAnswerItem === blitzTranslation,
    );

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
}

export const blitzService = new BlitzService(shuffleService, numbersService);

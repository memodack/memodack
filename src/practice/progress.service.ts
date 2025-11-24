import { singleton } from "tsyringe";

export interface IProgressService {
  resetProgress(): void;
  getProgress(): number;
  positiveProgress(): void;
  negativeProgress(): void;
}

@singleton()
export class ProgressService implements IProgressService {
  private progress: number = 0;

  resetProgress(): void {
    this.progress = 0;
  }

  getProgress(): number {
    return this.progress - 1;
  }

  positiveProgress(): void {
    this.progress += 1;
  }

  negativeProgress(): void {
    this.progress -= 1;
  }
}

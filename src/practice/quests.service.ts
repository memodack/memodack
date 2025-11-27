import { inject, singleton } from "tsyringe";
import type { ISettingsService } from "../services/settings.service";
import type { IWord } from "../types";
import { QuestItem } from "./quest-item";
import type { IRandomService } from "./random.service";

export interface IQuestsService {
  createQuests(words: IWord[]): void;
  getQuest(index: number): QuestItem | null;
  getCount(): number;
  cloneQuest(index: number): void;
  clear(): void;
}

@singleton()
export class QuestsService implements IQuestsService {
  private questItems = new Map<number, QuestItem>();

  constructor(
    @inject("ISettingsService")
    private readonly settingsService: ISettingsService,
    @inject("IRandomService") readonly randomService: IRandomService,
  ) {}

  createQuests(words: IWord[]): void {
    const shuffleWords = this.randomService.shuffleArray(words);

    shuffleWords.forEach((word, index) => {
      const [n1, n2, n3] = this.randomService.getNumbers(shuffleWords.length, index, 3);

      const isDivider = this.settingsService.getTranslationDivider();

      const q1 = isDivider ? this.randomService.getSegment(word.translation) : word.translation;
      const q2 = isDivider ? this.randomService.getSegment(shuffleWords[n1].translation) : shuffleWords[n1].translation;
      const q3 = isDivider ? this.randomService.getSegment(shuffleWords[n2].translation) : shuffleWords[n2].translation;
      const q4 = isDivider ? this.randomService.getSegment(shuffleWords[n3].translation) : shuffleWords[n3].translation;

      const answers = [q1, q2, q3, q4];
      const shuffleAnswers = this.randomService.shuffleArray(answers);
      const correctAnswerId = shuffleAnswers.indexOf(q1);

      const helpText = JSON.stringify(word.value) === JSON.stringify(word?.text) ? null : word?.text;

      const questItem = new QuestItem({
        imageUrl: word?.imageUrl,
        question: word.value,
        helpText,
        answers: shuffleAnswers,
        correctAnswerId,
      });

      this.questItems.set(index, questItem);
    });
  }

  getQuest(index: number): QuestItem | null {
    return this.questItems.get(index) || null;
  }

  getCount(): number {
    return this.questItems.size;
  }

  cloneQuest(index: number): void {
    const quest = this.questItems.get(index) as QuestItem;

    const shuffleAnswers = this.randomService.shuffleArray(quest.getAnswers());
    const translation = quest.getTranslation();
    const correctAnswerId = shuffleAnswers.indexOf(translation);

    const questItem = new QuestItem({
      imageUrl: quest.getImageUrl(),
      question: quest.getQuestion(),
      helpText: quest?.getHelpText(),
      answers: shuffleAnswers,
      correctAnswerId,
    });

    this.questItems.set(this.questItems.size, questItem);
  }

  clear(): void {
    this.questItems.clear();
  }
}

import { type App, Modal } from "obsidian";
import { inject, singleton } from "tsyringe";
import type { IConductorService } from "../services/conductor.service";
import type { ISettingsService } from "../services/settings.service";
import { ETextTruncate } from "../types";
import type { IProgressService } from "./progress.service";
import type { IQuestsService } from "./quests.service";
import type { ITextService } from "./text.service";
import { AnswerButtonUI, type IAnswerButtonUI } from "./ui/answer-button.ui";
import { AnswersContainerUI } from "./ui/answers-container.ui";
import { HelpTextUI, type IHelpTextUI } from "./ui/help-text.ui";
import { type IImageUI, ImageUI } from "./ui/image.ui";
import { type INextButtonUI, NextButtonUI } from "./ui/next-button.ui";
import { type IProgressBarUI, ProgressBarUI } from "./ui/progress-bar.ui";
import { type IQuestionUI, QuestionUI } from "./ui/question.ui";

export interface IPracticeModalService {
  open(): void;
}

@singleton()
export class PracticeModalService extends Modal implements IPracticeModalService {
  private imageUI!: IImageUI;
  private questionUI!: IQuestionUI;
  private helpTextUI!: IHelpTextUI;
  private progressBarUI!: IProgressBarUI;
  private nextButtonUI!: INextButtonUI;

  constructor(
    @inject("app") app: App,
    @inject("ISettingsService") private readonly settingsService: ISettingsService,
    @inject("IConductorService")
    private readonly conductorService: IConductorService,
    @inject("IQuestsService") readonly questsService: IQuestsService,
    @inject("ITextService") private readonly textService: ITextService,
    @inject("IProgressService") private readonly progressService: IProgressService,
  ) {
    super(app);

    this.imageUI = new ImageUI(this.contentEl);
    this.questionUI = new QuestionUI(this.contentEl);
    this.helpTextUI = new HelpTextUI(this.contentEl);
    this.progressBarUI = new ProgressBarUI(this.contentEl);
    this.nextButtonUI = new NextButtonUI(this.contentEl);
  }

  onOpen(): void {
    this.progressService.resetProgress();
    this.clear();
    const beginIndex = 0;
    this.progressBarUI.create(this.questsService.getCount(), beginIndex);
    this.createQuest(beginIndex);
  }

  onClose(): void {
    this.clear();
    this.progressService.resetProgress();
    this.questsService.clear();
  }

  private createQuest(questIndex: number) {
    const quest = this.questsService.getQuest(questIndex);

    if (!quest) {
      this.close();
      return;
    }

    this.progressService.positiveProgress();

    this.clear();

    /**
     * Image
     */
    this.imageUI.create(quest.getImageUrl());

    /**
     * Question
     */
    this.questionUI.create(quest.getQuestion());

    /**
     * Help Text
     */
    this.helpTextUI.create(quest.getHelpText());

    void this.conductorService.playValue(quest.getQuestion());

    /**
     * Answers
     */
    let correctAnswerButton: IAnswerButtonUI;

    const answersButtons: IAnswerButtonUI[] = [];

    const answersContainerUI = new AnswersContainerUI(this.contentEl);
    answersContainerUI.create();

    quest.getAnswers().forEach((item, index) => {
      const answerButtonUI = new AnswerButtonUI(answersContainerUI.getElement());
      answerButtonUI.create();

      if (quest.checkAnswer(index)) {
        correctAnswerButton = answerButtonUI;
      }

      answersButtons.push(answerButtonUI);

      const answerText = this.getAnswerText(item);
      answerButtonUI.setText(answerText);

      answerButtonUI.onClick(() => {
        answersButtons.forEach((item) => {
          item.disable();
        });

        /**
         * Check Answer
         */
        if (quest.checkAnswer(index)) {
          /**
           * Correct
           */
          answerButtonUI.correct();
          void this.conductorService.playTranslation(item);
        } else {
          /**
           * Wrong
           */
          answerButtonUI.wrong();
          correctAnswerButton.correct();
          this.questsService.cloneQuest(questIndex);
          this.progressService.negativeProgress();
        }

        const questsSize = this.questsService.getCount();

        /**
         * End
         */
        if (questsSize === questIndex) {
          this.close();
          return;
        }

        this.nextButtonUI.enable();
      });
    });

    /**
     * Progress Bar
     */
    answersContainerUI.appendChild(this.progressBarUI.getElement());
    this.progressBarUI.setValue(this.progressService.getProgress());

    /**
     * Next Button
     */
    this.nextButtonUI.create();
    this.nextButtonUI.disable();
    this.nextButtonUI.onClick(() => {
      this.createQuest(questIndex + 1);
    });
  }

  private clear() {
    this.contentEl.empty();
  }

  private getAnswerText(text: string): string {
    const textTruncatePosition = this.settingsService.getTextTruncate();

    if (textTruncatePosition === ETextTruncate.Disabled) {
      return text;
    } else {
      const dividerSymbol = ";";

      if (text.includes(dividerSymbol)) {
        return text
          .split(dividerSymbol)
          .map((t) => this.textService.truncate(t, textTruncatePosition))
          .join(`${dividerSymbol} `);
      } else {
        return text
          .split(" ")
          .map((t) => this.textService.truncate(t, textTruncatePosition))
          .join(" ");
      }
    }
  }
}

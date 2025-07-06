import { FormQuestion } from "../Classes/FormQuestion";

class DonutChartCalculator {
  formQuestionListArray: Array<FormQuestion>;
  resultQuestionListArray: Array<FormQuestion>;
  sliderValue: number;

  constructor() {
    this.formQuestionListArray = [];
    this.resultQuestionListArray = [];
    this.sliderValue = 50;
  }

  setFormQuestionList(_formQuestionListArray: Array<FormQuestion>) {
    this.resultQuestionListArray = [];
    this.formQuestionListArray = [];
    this.formQuestionListArray = _formQuestionListArray;
  }

  setNewAnswerValue(question: FormQuestion, ValueList: Array<number>) {
    question.setAnswerValue(ValueList[question.AnswerValue - 1]);
  }

  calcPhase1Type2Questions() {
    const Phase1Type2Items: Array<FormQuestion> =
      this.formQuestionListArray.filter(
        (question: FormQuestion) =>
          question.PhaseId === 1 && question.QuestionType === 2
      );

    Phase1Type2Items.forEach((question: FormQuestion) => {
      switch (question.QuestionId) {
        case 2:
          this.setNewAnswerValue(question, [1, 2, 3, 4]);
          break;

        case 3:
          this.setNewAnswerValue(question, [4, 3, 2, 1]);
          break;

        case 4:
          this.setNewAnswerValue(question, [4, 3, 2, 1]);
          break;

        case 5:
          this.setNewAnswerValue(question, [4, 3, 2, 1]);
          break;

        case 6:
          this.setNewAnswerValue(question, [4, 3, 2, 1]);
          break;
      }
      this.resultQuestionListArray.push(question);
    });
  }

  calcPhase2Type3Questions() {
    const Phase2Type3Items: Array<FormQuestion> =
      this.formQuestionListArray.filter(
        (question: FormQuestion) =>
          question.PhaseId === 2 &&
          question.QuestionType === 3 &&
          question.AnswerValue === 2
      );

    let instance: FormQuestion;

    if (Phase2Type3Items.length === 0) {
      instance = this.formQuestionListArray.filter(
        (question: FormQuestion) =>
          question.PhaseId === 2 && question.QuestionType === 3
      )[0];
    } else {
      instance = Phase2Type3Items[Phase2Type3Items.length - 1];
    }

    const copy = new (instance.constructor as { new (): FormQuestion })();
    const question: FormQuestion = Object.assign(copy, instance);
    Object.assign(copy, question);

    switch (question.QuestionId) {
      case 8:
        this.setNewAnswerValue(question, [0, 0]);
        break;

      case 9:
        this.setNewAnswerValue(question, [0, 2]);
        break;

      case 10:
        this.setNewAnswerValue(question, [0, 4]);
        break;

      case 11:
        this.setNewAnswerValue(question, [0, 6]);
        break;

      case 12:
        this.setNewAnswerValue(question, [0, 8]);
        break;

      case 13:
        this.setNewAnswerValue(question, [0, 10]);
        break;
    }
    this.resultQuestionListArray.push(question);
  }

  calcSliderValue(): number {
    this.calcPhase1Type2Questions();

    this.calcPhase2Type3Questions();

    const filteredResultList: Array<FormQuestion> =
      this.resultQuestionListArray.filter(
        (question) => question.QuestionType === 2 || question.QuestionType === 3
      );

    let _sliderValue: number = 0;

    filteredResultList.forEach((question: FormQuestion) => {
      this.resultQuestionListArray.push(question);
      _sliderValue = _sliderValue + question.AnswerValue;
    });

    if (_sliderValue <= 6) {
      //Sehr konservativ
      return 10;
    } else if (_sliderValue >= 7 && _sliderValue <= 12) {
      //Konservativ
      return 25;
    } else if (_sliderValue >= 13 && _sliderValue <= 18) {
      //Ausgewogen
      return 50;
    } else if (_sliderValue >= 19 && _sliderValue <= 24) {
      //Wachstum
      return 75;
    } else if (_sliderValue >= 25) {
      //Riskofreudig
      return 90;
    }

    return 0;
  }
}

export { DonutChartCalculator };

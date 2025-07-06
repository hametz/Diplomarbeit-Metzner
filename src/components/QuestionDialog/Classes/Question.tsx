class Answer {
  AnswerText: string;
  AnswerValue: number;

  constructor(answerText: string, answerValue: number) {
    this.AnswerText = answerText;
    this.AnswerValue = answerValue;
  }
}

const AnswerListType2 = [
  new Answer("Stimme ich gar nicht zu", 1),
  new Answer("Stimme ich teilweise zu", 2),
  new Answer("Stimme ich überwiegend zu", 3),
  new Answer("Stimme ich voll zu", 4),
];

const AnswerListType3 = [new Answer("Option A", 1), new Answer("Option B", 2)];

class Question {
  Id: number;
  QuestionType: number;
  Question: string;
  Question2: string;
  pQId: number;
  phaseId: number;
  phaseQuestion: string;
  phaseSubQuestion: string;
  Answers: Array<Answer>;

  constructor(
    id: number,
    questionType: number,
    question: string,
    question2: string,
    pQId: number,
    phaseId: number,
    phaseQuestion: string,
    phaseSubQuestion: string
  ) {
    this.Id = id;
    this.QuestionType = questionType;
    this.Question = question;
    this.Question2 = question2;
    this.pQId = pQId;
    this.phaseId = phaseId;
    this.phaseQuestion = phaseQuestion;
    this.phaseSubQuestion = phaseSubQuestion;
    this.Answers = this.setAnswerList();
  }

  setAnswerList(): Array<Answer> {
    if (this.QuestionType === 2) {
      return AnswerListType2;
    } else if (this.QuestionType === 3) {
      return AnswerListType3;
    } else {
      return [];
    }
  }
}

export { Answer, Question };

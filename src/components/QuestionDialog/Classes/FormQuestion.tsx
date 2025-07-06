//Liste der aufgenommen Daten
//QuestionId
//PhaseId
//PhaseQuestion
//Question
//Question2
//Answer
//AnswerValue

class FormQuestion {
  QuestionId: number;
  PhaseId: number;
  PhaseQuestion: string;
  QuestionType: number;
  Question: string;
  Question2: string;
  Answer: string;
  AnswerValue: number;
  Required: boolean;

  constructor(
    questionId: number,
    phaseId: number,
    phaseQuestion: string,
    questionType: number,
    question: string,
    question2: string,
    required: boolean
  ) {
    this.QuestionId = questionId;
    this.PhaseId = phaseId;
    this.PhaseQuestion = phaseQuestion;
    this.QuestionType = questionType;
    this.Question = question;
    this.Question2 = question2;
    this.Answer = "";
    this.AnswerValue = 0;
    this.Required = required;
  }

  setAnswer(answer: string) {
    this.Answer = answer;
  }

  setAnswerValue(answerValue: number) {
    this.AnswerValue = answerValue;
  }
}

export { FormQuestion };

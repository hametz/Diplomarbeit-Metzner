import axios, { type AxiosResponse } from "axios";
import type { FormQuestion } from "../QuestionDialog/Classes/FormQuestion";

interface NumberStringTuple extends Array<string | number> {
  0: number;
  1: string;
  2: string;
  3: string;
  4: string;
  5: number;
}

//Sendet FormQuestionListe an Datenbank und
//eröffnent Session für den Eintrag auf der Datenbank
function insertQuestionForm(
  formQuestionList: Array<FormQuestion>,
  _userId: string,
  calcSliderValue: number,
  userSliderValue: number,
  surveyMethod: string
) {
  const questionData: Array<NumberStringTuple> = [];

  let reponseData: boolean = false;

  formQuestionList.forEach((question: FormQuestion) => {
    const formQuestionData: NumberStringTuple = [
      question.PhaseId,
      question.PhaseQuestion,
      question.Question,
      question.Question2,
      question.Answer,
      question.AnswerValue,
    ];

    questionData.push(formQuestionData);
  });

  const data = {
    operation: "insertQuestionForm",
    userId: _userId,
    questionData: questionData,
    calcSliderValue: calcSliderValue,
    userSliderValue: userSliderValue,
    surveyMethod: surveyMethod,
  };

  axios
    .post("server/DataBaseManager.php", data)
    .then(function (response: AxiosResponse) {
      reponseData = true;
      console.log(response);
      console.clear();
    });

  return reponseData;
}

export { insertQuestionForm };

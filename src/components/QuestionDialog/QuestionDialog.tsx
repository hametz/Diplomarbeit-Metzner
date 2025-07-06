import {
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactElement,
} from "react";
import parse from "html-react-parser";
import { Question } from "./Classes/Question";
import { FormQuestion } from "./Classes/FormQuestion";
import ProgressionBar from "./Progression/ProgressionBar";

import eclipse_full from "../../assets/img/Ellipse_Full.png";
import eclipse_empty from "../../assets/img/Ellipse_Empty.png";
import eclipse_1_3 from "../../assets/img/Ellipse_1_3.png";
import eclipse_2_3 from "../../assets/img/Ellipse_2_3.png";
import eclipse_a from "../../assets/img/Ellipse_A.png";
import eclipse_b from "../../assets/img/Ellipse_B.png";

import data from "../../data/data.json";
import SessionStorageManager from "../SessionStorage/SessionStorageManager";
import UserInfo from "../UserInfo";
import { useNavigate } from "react-router-dom";
import DonutChartDialog from "./DonutChart/DonutChartDialog";

const isAdmin: boolean =
  import.meta.env.VITE_IS_ADMIN_MODE === "true" ? true : false;

function QuestionDialog() {
  const [questionList, setQuestionList] = useState<Array<Question>>([]);
  const [formQuestionList, setFormQuestionList] = useState<Array<FormQuestion>>(
    []
  );
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(1);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  const [userId, setUserId] = useState<string>("");

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const maxQuestionRef = useRef<number>(0);

  const sessionStorageManager: SessionStorageManager =
    new SessionStorageManager();

  const navigate = useNavigate();

  const checkForValidMethod = () => {
    const sessionMethod: string = sessionStorageManager.method;
    const sessionUserId: string = sessionStorageManager.userId;

    if (sessionMethod === undefined || sessionUserId === undefined) {
      navigate("/error");
    } else if (sessionMethod === "chatbot") {
      navigate("/chatbot");
    }
  };

  //Befüllt QuestionList mit Daten aus der Data.json
  useEffect(() => {
    if (!isAdmin) checkForValidMethod();

    setUserId(sessionStorageManager.userId);

    const _questionList: Array<Question> = [];
    const _formQuestionList: Array<FormQuestion> = [];

    data.forEach((phase) => {
      phase.items.forEach((question) => {
        const _question: Question = new Question(
          question.id,
          question.type,
          question.question,
          question.question2,
          question.qId,
          phase.phaseId,
          phase.phaseQuestion,
          phase.phaseSubQuestion
        );

        _questionList.push(_question);
        _formQuestionList.push(
          new FormQuestion(
            _question.pQId,
            _question.phaseId,
            _question.phaseQuestion,
            _question.QuestionType,
            _question.Question,
            _question.Question2,
            _question.QuestionType === 1 || _question.QuestionType === 4
              ? false
              : true
          )
        );
      });
    });

    maxQuestionRef.current = _questionList.length;
    setQuestionList(_questionList);
    setFormQuestionList(_formQuestionList);
  }, []);

  //Weiterleitung zum Kuchendiagramm
  const handleOnSubmit = () => {
    setIsSubmitted(true);
  };

  //Springe Frage mittel des weitergegebenen Indexes
  const goToQuestion = useCallback((index: number) => {
    setActiveQuestionIndex(index);
  }, []);

  //Nächste Frage auswählen
  const handleNextQuestion = (questionId: number) => {
    if (!showError) {
      // eslint-disable-next-line prefer-const
      let isAnswered: boolean = validateAnswer(questionId);

      if (isAnswered) {
        goToQuestion(
          activeQuestionIndex >= maxQuestionRef.current
            ? maxQuestionRef.current
            : activeQuestionIndex + 1
        );
      }
    }
  };

  //Vorherige Frage auswählen
  const handlePrevQuestion = () => {
    goToQuestion(activeQuestionIndex <= 1 ? 1 : activeQuestionIndex - 1);
  };

  //Antwortbilder für verschiedene QuestionTypes auswählen
  const getAnswerImg = (answerIndex: number, questionType: number) => {
    switch (answerIndex) {
      case 1:
        if (questionType === 3) {
          return eclipse_a;
        }
        return eclipse_empty;

      case 2:
        if (questionType === 3) {
          return eclipse_b;
        }
        return eclipse_1_3;

      case 3:
        return eclipse_2_3;

      case 4:
        return eclipse_full;

      default:
        return eclipse_empty;
    }
  };

  //Antwort auswählen
  const selectAnswer = (
    answerId: number,
    answerText: string,
    questionId: number,
    eventTarget: HTMLElement
  ) => {
    const parentElement = eventTarget.offsetParent as HTMLElement;
    const answerList: HTMLElement = parentElement.offsetParent!.querySelector(
      ".question-form-answers"
    ) as HTMLElement;

   

    //Abwählen aller anderen Antwort-Elemente, die nicht gerade ausgewählt werden
    if (answerList.childNodes) {
      answerList.childNodes.forEach((element) => {
        if (element instanceof HTMLElement) {
          const elementDataValue: string = element.getAttribute(
            "data-value"
          ) as string;
          if (
            element.getAttribute("data-type") &&
            elementDataValue != answerId.toString()
          ) {
            element.removeAttribute("data-type");
          }
        }
      });
    }

    //Anwählen des geklickten Elementes
    if (parentElement.getAttribute("data-type")) {
      //Abwählen der Werte des geklickten Elementes
      parentElement.removeAttribute("data-type");
      formQuestionList
        .find((element: FormQuestion) => element.QuestionId === questionId)
        ?.setAnswer("");
      formQuestionList
        .find((element: FormQuestion) => element.QuestionId === questionId)
        ?.setAnswerValue(0);
    } else {
      //Einschreiben der Werte des geklickten Elementes
      parentElement.setAttribute("data-type", "selected");
      formQuestionList
        .find((element: FormQuestion) => element.QuestionId === questionId)
        ?.setAnswer(answerText);
      formQuestionList
        .find((element: FormQuestion) => element.QuestionId === questionId)
        ?.setAnswerValue(answerId);
      setShowError(false);
    }
  };

  //Überprüfen der Antwort beim erneuten Zurückgehen und eventuellen Antwort änderns
  const validateAnswer = (questionId: number): boolean => {
    const formQuestionAnswerValue: number = formQuestionList.find(
      (element: FormQuestion) => element.QuestionId === questionId
    )?.AnswerValue as number;

    const formQuestionAnswer: string = formQuestionList.find(
      (element: FormQuestion) => element.QuestionId === questionId
    )?.Answer as string;

    const required: boolean = formQuestionList.find(
      (element: FormQuestion) => element.QuestionId === questionId
    )?.Required as boolean;

    if (required) {
      if (formQuestionAnswerValue > 0 && formQuestionAnswer.length > 0) {
        setShowError(false);
        return true;
      }
    } else {
      setShowError(false);
      return true;
    }
    setErrorText("Bitte wählen Sie eine Antwort aus, bevor Sie weitermachen");
    setShowError(true);

    return false;
  };

  //QuestionFormError Komponent
  const QuestionFormError = (): ReactElement => {
    if (showError) {
      return <div className="question-form-error">{errorText}</div>;
    }
    return <></>;
  };

  //QuestionFormAnswers Komponent
  const QuestionFormElement = (): ReactElement => {
    return (
      <>
        {questionList.map((questionItem) => {
          return (
            <div
              className="question-form-element"
              key={questionItem.pQId}
              data-type={
                activeQuestionIndex === questionItem.pQId ? "show" : "hidden"
              }
              data-error={showError ? "true" : ""}>
              <h3
                className="question-form-header"
                data-type={questionItem.Question.length > 100 ? "long" : ""}>
                {parse(questionItem.Question)}
              </h3>
              {questionItem.Question2.length > 0 ? (
                <h3 className="question-form-header">
                  {parse(questionItem.Question2)}
                </h3>
              ) : (
                <></>
              )}
              {questionItem.QuestionType === 1 ? (
                <div className="question-placeholder"></div>
              ) : (
                QuestionFormAnswers(questionItem)
              )}
              {QuestionFormControls(questionItem.pQId)}
            </div>
          );
        })}
      </>
    );
  };

  //QuestionFormAnswers Komponent
  const QuestionFormAnswers = (questionItem: Question): ReactElement => {
    if (questionItem.Answers.length > 0) {
      return (
        <div
          className="question-form-answers"
          data-type={questionItem.Answers.length === 2 ? "duo" : ""}>
          {questionItem.Answers.map((answerItem) => {
            return (
              <div
                className="question-form-answer"
                data-value={answerItem.AnswerValue}
                key={questionItem.Id + "-" + answerItem.AnswerValue}>
                <div
                  className="question-form-answer-btn"
                  onClick={(event) =>
                    selectAnswer(
                      answerItem.AnswerValue,
                      answerItem.AnswerText,
                      questionItem.pQId,
                      event.target as HTMLElement
                    )
                  }></div>
                <img
                  src={getAnswerImg(
                    answerItem.AnswerValue,
                    questionItem.QuestionType
                  )}></img>
                <p className="question-form-answer-text">
                  {answerItem.AnswerText}
                </p>
              </div>
            );
          })}
        </div>
      );
    }
    return <></>;
  };

  //QuestionFormControls Komponent
  const QuestionFormControls = (questionId: number): ReactElement => {
    return (
      <div className="dialog-btn-wrapper">
        <div onClick={() => handlePrevQuestion()} className="btn btn-inverted">
          ZURÜCK
        </div>
        {activeQuestionIndex < maxQuestionRef.current ? (
          <div onClick={() => handleNextQuestion(questionId)} className="btn">
            WEITER
          </div>
        ) : (
          <div onClick={() => handleOnSubmit()} className="btn">
            AUSWERTEN
          </div>
        )}
      </div>
    );
  };

  //QuestionForm Komponent
  const QuestionForm = (): ReactElement => {
    return (
      <div className="question-form">
        <ProgressionBar
          maxQuestion={maxQuestionRef.current}
          questionList={questionList}
          activeQuestionIndex={activeQuestionIndex}
        />
        {QuestionFormError()}
        {QuestionFormElement()}
      </div>
    );
  };

  return (
    <>
      {isAdmin ? <UserInfo /> : <></>}
      {!isSubmitted ? (
        QuestionForm()
      ) : (
        <>
          {" "}
          <DonutChartDialog
            formQuestionList={formQuestionList}
            userId={userId}
            method={"RoboAdvisor"}
          />
        </>
      )}
    </>
  );
}

export default QuestionDialog;

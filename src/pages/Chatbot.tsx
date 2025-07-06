/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import UserInfo from "../components/UserInfo";
import SessionStorageManager from "../components/SessionStorage/SessionStorageManager";
import data from "../data/data.json";
import { FormQuestion } from "../components/QuestionDialog/Classes/FormQuestion";
import { useNavigate } from "react-router-dom";
import DonutChartDialog from "../components/QuestionDialog/DonutChart/DonutChartDialog";

const isAdmin: boolean =
  import.meta.env.VITE_IS_ADMIN_MODE === "true" ? true : false;

interface DfMessengerEvent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detail: any;
  event: CustomEvent;
}

class ChatBotFormQuestion {
  questionId: number;
  answer: string;
  answerValue: number;

  constructor() {
    this.questionId = 0;
    this.answer = "";
    this.answerValue = 0;
  }

  setQuestionId(questionId: number) {
    this.questionId = questionId;
  }
  setAnswer(answer: string) {
    this.answer = answer;
  }

  setAnswerValue(answer: string) {
    switch (answer) {
      case "Ich stimme gar nicht zu":
        this.answerValue = 1;
        break;

      case "Ich stimme teilweise zu":
        this.answerValue = 2;
        break;

      case "Ich stimme überwiegend zu":
        this.answerValue = 3;
        break;

      case "Ich stimme voll zu":
        this.answerValue = 4;
        break;

      case "Option A":
        this.answerValue = 1;
        break;

      case "Option B":
        this.answerValue = 2;
        break;

      case "Option B":
        this.answerValue = 2;
        break;
    }
  }
}

function Chatbot() {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [cBFormQuestionList] = useState<Array<ChatBotFormQuestion>>([]);

  let cBFormQuestion: ChatBotFormQuestion = new ChatBotFormQuestion();
  let questionIndex: number = -1;

  const sessionManager: SessionStorageManager = new SessionStorageManager();
  sessionManager.getSessionUserId();
  const userId: string = sessionManager.userId;

  const navigate = useNavigate();

  const checkForValidMethod = () => {
    const sessionMethod: string = sessionManager.method;
    const sessionUserId: string = sessionManager.userId;

    if (sessionMethod === undefined || sessionUserId === undefined) {
      navigate("/error");
    } else if (sessionMethod === "robo-advisor") {
      navigate("/robo-advisor");
    }
  };

  useEffect(() => {
    if (!isAdmin) checkForValidMethod();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dfTitlebar: any = document.querySelector("df-messenger");

    if (dfTitlebar !== null || dfTitlebar !== undefined)
      dfTitlebar.setAttribute("chat-title", "Charles");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dfMessenger: any = document.querySelector("df-messenger");

    if (dfMessenger !== null) {
      dfMessenger.addEventListener(
        "df-chip-clicked",
        function (event: DfMessengerEvent) {
          const _answer: string = event.detail.query;
          if (_answer.length > 0 && cBFormQuestion.questionId > 0) {
            cBFormQuestion.setAnswer(_answer);
            cBFormQuestion.setAnswerValue(_answer);

            questionIndex++;
            if (questionIndex === cBFormQuestionList.length) {
              cBFormQuestionList.push(cBFormQuestion);
              cBFormQuestion = new ChatBotFormQuestion();
            }
          }
        }
      );

      dfMessenger.addEventListener(
        "df-response-received",
        function (event: DfMessengerEvent) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const messageFullFillmentArray =
            event.detail.response.queryResult.fulfillmentMessages;

          messageFullFillmentArray.forEach(
            (element: {
              payload: { richContent: { subtitle: string | undefined }[][] };
            }) => {
              if (element?.payload) {
                const messageSubTitle: string | undefined =
                  element.payload.richContent[0][0]?.subtitle;

                if (messageSubTitle) {
                  const _questionId: number = parseInt(
                    messageSubTitle.replace("ID_", "")
                  );
                  cBFormQuestion.setQuestionId(_questionId);
                }
              }
            }
          );
        }
      );

      dfMessenger.addEventListener("df-button-clicked", function () {
        setIsSubmitted(true);
      });
    }
  }, []);

  const chatComponent = () => {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html:
            `
        <df-messenger
        chat-icon="https:&#x2F;&#x2F;i.postimg.cc&#x2F;CKgPWgQp&#x2F;22-Apr-2025-14-02-59.png"
        intent="WELCOME"
        chat-title="Robo-Advisor"
        agent-id="26133efe-59d2-4231-b651-17a56241e5b0"` +
            import.meta.env.VITE_CHATBOT +
            `
        language-code="de"
        expand="true"
        ></df-messenger>
`,
        }}
      />
    );
  };

  const map_ChatBotFormArray_Into_FormQuestionArray =
    (): Array<FormQuestion> => {
      // eslint-disable-next-line prefer-const
      let formQuestionArray: Array<FormQuestion> = [];

      cBFormQuestionList.forEach((cbQuestion: ChatBotFormQuestion) => {
        let phase = null;
        let question = null;
        if (cbQuestion.questionId <= 6) {
          phase = data.filter((dataArray) => dataArray.phaseId === 1)[0];
          question = phase.items.filter(
            (questionItem) => questionItem.qId === cbQuestion.questionId
          )[0];
        } else {
          phase = data.filter((dataArray) => dataArray.phaseId === 2)[0];
          question = phase.items.filter(
            (questionItem) => questionItem.qId === cbQuestion.questionId
          )[0];
        }

        const formQuestion: FormQuestion = new FormQuestion(
          cbQuestion.questionId,
          phase.phaseId,
          phase.phaseQuestion,
          question.type,
          question.question,
          question.question2,
          true
        );

        formQuestion.setAnswer(cbQuestion.answer);
        formQuestion.setAnswerValue(cbQuestion.answerValue);

        formQuestionArray.push(formQuestion);
      });

      return formQuestionArray;
    };

  return (
    <>
      {isAdmin ? <UserInfo /> : <></>}
      {isSubmitted ? (
        <DonutChartDialog
          formQuestionList={map_ChatBotFormArray_Into_FormQuestionArray()}
          userId={userId}
          method={"Chatbot"}
        />
      ) : (
        chatComponent()
      )}
    </>
  );
}

export default Chatbot;

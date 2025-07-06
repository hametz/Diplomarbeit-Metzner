import { useRef, useEffect, useState } from "react";
import { Question } from "../Classes/Question";

interface ProgressionBar {
  activeQuestionIndex?: number;
  maxQuestion: number;
  questionList: Array<Question>;
}

function ProgressionBar({
  activeQuestionIndex,
  maxQuestion,
  questionList,
}: ProgressionBar) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [activeQuestion, setActiveQuestion] = useState<Question>();
  const [activePhaseMaxItems, setActivePhaseMaxItems] = useState<number>();

  useEffect(() => {
    if (activeQuestionIndex) {
      const progression = ((activeQuestionIndex - 1) / maxQuestion) * 100;

      setActiveQuestion(questionList[activeQuestionIndex - 1]);
      setActivePhaseMaxItems(
        questionList.filter(
          (e: Question) =>
            e.phaseId === questionList[activeQuestionIndex - 1].phaseId
        ).length
      );

      if (progressBarRef.current) {
        progressBarRef.current.style.width = progression + "%";
      }
    }
  }, [activeQuestionIndex, maxQuestion, questionList]);

  return (
    <div className="progression-bar-wrapper">
      <div className="progression-bar">
        <div className="progression-bar-bg">
          <div className="progression-bar-fg" ref={progressBarRef}></div>
        </div>
      </div>
      <div className="progression-bar-content">
        <h4 className="progression-bar-content-header">
          {activeQuestion?.Id + "/" + activePhaseMaxItems}
        </h4>
        <h4 className="progression-bar-content-header">
          {activeQuestion?.phaseQuestion}
        </h4>
        {activeQuestion && activeQuestion.phaseSubQuestion.length > 0 ? (
          <h4 className="progression-bar-content-header">
            {activeQuestion?.phaseSubQuestion}
          </h4>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default ProgressionBar;

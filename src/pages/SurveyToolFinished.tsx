import { useEffect } from "react";
import SessionStorageManager from "../components/SessionStorage/SessionStorageManager";

function SurveyToolFinished() {
  useEffect(() => {
    const sessionStorageManager: SessionStorageManager =
      new SessionStorageManager();

    sessionStorageManager.clearSessionStorage();
  }, []);

  return (
    <div className="sn-wrapper" data-type="success">
      <p>Test abgeschlossen</p>
      <p>Sie können nun weiter mit der Umfrage machen</p>
    </div>
  );
}

export default SurveyToolFinished;

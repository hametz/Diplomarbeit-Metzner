import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SessionStorageManager from "../components/SessionStorage/SessionStorageManager";

function Router() {
  //http://localhost:5173/acaad266-f73e-4e4c-afb6-a6546694363f&chatbot/
  //http://localhost:5173/acaad266-f73e-4e4c-afb6-a6546694363f&robo-advisor/

  //https://diplomarbeit-metzner.de/acaad266-f73e-4e4c-afb6-a6546694363f&chatbot/
  //https://diplomarbeit-metzner.de/acaad266-f73e-4e4c-afb6-a6546694363f&robo-advisor/

  const [userId, setUserId] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  const navigate = useNavigate();

  const sessionStorageManager: SessionStorageManager =
    new SessionStorageManager();

  const getUrlData = () => {
    const url: string = window.location.href;
    const cutString: string = "https://diplomarbeit-metzner.de/";
    //const cutString: string = "http://dev.diplomarbeit-metzner.de/";
    //const cutString: string = "http://localhost:5173/";
    const indexCut: number = url.indexOf(cutString);
    let _userId: string = url.substring(
      indexCut + cutString.length,
      url.length
    );
    const _method: string = _userId.substring(
      _userId.indexOf("&") + 1,
      _userId.length - 1
    );

    _userId = _userId.replace("&" + _method + "/", "");

    setMethod(_method);
    setUserId(_userId);
  };

  useEffect(() => {
    if (sessionStorageManager.checkSessionStorageForUserAndMethod() === false) {
      getUrlData();
    } else {
      setUserId(sessionStorageManager.userId);
      setMethod(sessionStorageManager.method);
    }
  }, []);

  useEffect(() => {
    if (userId.length === 36 && userId.includes("-")) {
      if (method === "robo-advisor" || method === "chatbot") {
        sessionStorageManager.setSessionUserId(userId);
        sessionStorageManager.setSessionMethod(method);
        navigateTo("/" + method);
      } else {
        setIsError(true);
      }
    }
  }, [userId, method]);

  useEffect(() => {
    if (isError) {
      navigate("/error");
    }
  }, [isError]);

  const navigateTo = (link: string) => {
    navigate(link);
  };

  return <></>;
}

export default Router;

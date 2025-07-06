import type { FormQuestion } from "../QuestionDialog/Classes/FormQuestion";

class SessionStorageManager {
  userId: string;
  method: string;
  formQuestionList: Array<FormQuestion>;

  constructor() {
    this.userId = "";
    this.method = "";
    this.formQuestionList = [];
    this.checkSessionStorageForUserAndMethod();
  }

  setSessionUserId(userId: string) {
    this.userId = userId;
    sessionStorage.setItem("userId", userId);
  }

  getSessionUserId() {
    const _userId: string | null = sessionStorage.getItem("userId");
    if (_userId) {
      this.userId = _userId;
    }
  }

  setSessionMethod(method: string) {
    this.method = method;
    sessionStorage.setItem("method", method);
  }

  getSessionMethod() {
    const _method: string | null = sessionStorage.getItem("method");
    if (_method) {
      this.method = _method;
    }
  }

  checkSessionStorageForUserAndMethod(): boolean {
    this.getSessionUserId();
    this.getSessionMethod();

    if (this.userId.length > 0 && this.method.length > 0) {
      return true;
    }

    return false;
  }

  setFormQuestionList(formQuestionList: Array<FormQuestion>) {
    this.formQuestionList = formQuestionList;
  }

  clearSessionStorage() {
    sessionStorage.clear();
  }
}

export default SessionStorageManager;

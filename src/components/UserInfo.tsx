import SessionStorageManager from "./SessionStorage/SessionStorageManager";

function UserInfo() {
  const sessionStorageManager: SessionStorageManager =
    new SessionStorageManager();

  sessionStorageManager.getSessionUserId();

  const isAdmin: boolean =
    import.meta.env.VITE_IS_ADMIN_MODE === "true" ? true : false;

  return (
    <div className="userInfo">
      {isAdmin ? "Kennung: " + sessionStorageManager.userId : ""}
    </div>
  );
}

export default UserInfo;

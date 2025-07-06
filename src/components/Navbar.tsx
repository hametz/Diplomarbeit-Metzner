import { HashLink } from "react-router-hash-link";

function Navbar() {
  const isAdmin: boolean =
    import.meta.env.VITE_IS_ADMIN_MODE === "true" ? true : false;

  return (
    <div className="nav">
      {isAdmin ? (
        <>
          <HashLink to="/robo-advisor">Robo Advisor</HashLink>
          <br></br>
          <HashLink to="/acaad266-f73e-4e4c-afb6-a6546694363f&robo-advisor/">
            Robo Advisor UUID Test
          </HashLink>
          <br></br>
          <HashLink to="/chatbot">Chatbot</HashLink>
          <br></br>
          <HashLink to="/acaad266-f73e-4e4c-afb6-a6546694363f&chatbot/">
            Chatbot UUID Test
          </HashLink>
          <br></br>
          <HashLink to="/error">Error</HashLink>
          <br></br>
          <HashLink to="/survey-finished">Success</HashLink>
          <br></br>
          <div className="btn" onClick={() => sessionStorage.clear()}>
            Clear SessionStorage
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Navbar;

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/styles/index.css";
import "./assets/styles/App.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import RoboAdvisor from "./pages/RoboAdvisor";
import Chatbot from "./pages/Chatbot";
import Error from "./pages/Error";
import SurveyToolFinished from "./pages/SurveyToolFinished";
import Router from "./pages/Router";
import ScrollAgent from "./Helper/ScrollAgent";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <ScrollAgent />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Router />,
      },
      {
        path: "/*",
        element: <Router />,
      },
      { path: "/robo-advisor", element: <RoboAdvisor /> },
      { path: "/chatbot", element: <Chatbot /> },
      { path: "/survey-finished", element: <SurveyToolFinished /> },
      { path: "/error", element: <Error /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

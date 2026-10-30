import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/register";
import Protected from "./features/auth/component/Protected";
import Home from "./features/interview/pages/Home";
import ResultPage from "./features/interview/pages/ResultPage";

export const route = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
  },
  {
    path: "/interview/:interviewid",
    element: (
      <Protected>
        <ResultPage />
      </Protected>
    ),
  },
]);
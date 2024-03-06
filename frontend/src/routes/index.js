import { createBrowserRouter } from "react-router-dom";
import {
  Sections,
  PrivateRoute,
  Register,
  Login,
  AppWrapper,
  Books,
  PageNotFound,
} from "../components";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppWrapper>
        <PrivateRoute>
          <Books />
        </PrivateRoute>
      </AppWrapper>
    ),
  },
  {
    path: "/books/:bookId/section/:sectionId",
    element: (
      <AppWrapper>
        <PrivateRoute>
          <Sections />
        </PrivateRoute>
      </AppWrapper>
    ),
  },
  {
    path: "/books/:bookId",
    element: (
      <AppWrapper>
        <PrivateRoute>
          <Sections />
        </PrivateRoute>
      </AppWrapper>
    ),
  },
  {
    path: "/register",
    element: (
      <AppWrapper>
        <Register />,
      </AppWrapper>
    ),
  },
  {
    path: "/login",
    element: (
      <AppWrapper>
        <Login />,
      </AppWrapper>
    ),
  },
  { path: "*", element: <PageNotFound /> },
]);

export default router;

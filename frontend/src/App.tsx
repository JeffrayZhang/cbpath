import axios from "axios";
import { useEffect, useState } from "react";
import { GoogleLoginButton } from "react-social-login-buttons";
import "./App.css";
import { API_URL } from "./lib/api";
import {
  authenticatedApiRequest,
  googleAuthProvider,
  signIn,
  useCurrentUser,
} from "./lib/firebase";
import logo from "./logo.svg";
import { CourseForm, CourseTable } from "./components/course-components";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { PageLayout } from "./components/layout";
import { Profile } from "./Profile";
import { Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import CoursePage from "./CoursePage";

/* === REPLACE ME === */
const { Search } = Input;
function HomePage() {
  const navigate = useNavigate();
  const onSearch = (value: string, _e: any) => navigate(`/course/${value}`);
  const loggedInUser = useCurrentUser();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img src={logo} className="App-logo" alt="logo" />
      <h2 style={{ textAlign: "center", margin: "20px" }}>
        Search for any CB Course and see what other students had to say!
      </h2>
      <Search
        placeholder="Course Code"
        allowClear
        enterButton="Search"
        size="large"
        onSearch={onSearch}
      />
      {/* <a href="/profile">Go to profile page</a> */}
      {!loggedInUser ? (
        <div>
          <h2 style={{ textAlign: "center", margin: "20px" }}>
            {" "}
            Sign up to leave a course review!{" "}
          </h2>
          <Button
            type="primary"
            size="large"
            style={{
              paddingLeft: "50px",
              paddingRight: "50px",
              margin: "15px",
            }}
            onClick={() => signIn(googleAuthProvider, navigate)}
          >
            Login/Register with Google{" "}
          </Button>
        </div>
      ) : null}{" "}
    </div>
  );
}
/* === REPLACE ME === */
const router = createBrowserRouter([
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/course/:courseID",
    element: <CoursePage />,
  },
]);

function App() {
  return (
    <PageLayout>
      <RouterProvider router={router} />
    </PageLayout>
  );
}

export default App;

import axios from 'axios';
import { useEffect, useState } from 'react';
import { GoogleLoginButton } from 'react-social-login-buttons';
import './App.css';
import { API_URL } from './lib/api';
import { googleAuthProvider, signIn, useCurrentUser } from './lib/firebase';
import logo from './logo.svg';
import { CourseForm, CourseTable } from './components/course-components';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { PageLayout } from './components/layout';
import { Profile } from './Profile';
import { Input } from 'antd';
import { useNavigate } from "react-router-dom";
import CoursePage from './CoursePage';

/* === REPLACE ME === */
const { Search } = Input;
const SignInPage = () => <div><p>SignIn page!</p><GoogleLoginButton onClick={() => signIn(googleAuthProvider)} /></div>
function HomePage(){
  const navigate = useNavigate()
  const onSearch = (value: string, _e: any,) => navigate(`/course/${value}`);
  return(<div>
    <img src={logo} className="App-logo" alt="logo" />
    <p>Home page!</p>
    <Search
        placeholder="Course Code"
        allowClear
        enterButton="Search"
        size="large"
        onSearch={onSearch}
      />
    <a href="/profile">Go to profile page</a>
  </div>)
} 
/* === REPLACE ME === */
const router = createBrowserRouter([
  {
    path: "/profile",
    element: <Profile/>,
  },
  {
    path: '/signin',
    element: <SignInPage />,
  },
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/course/:courseID',
    element:<CoursePage/>,
  }
]);


function App() {
  return (
    <PageLayout>
      <RouterProvider router={router} />
    </PageLayout>
  );
}

export default App;

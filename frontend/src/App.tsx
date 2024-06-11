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

/* === REPLACE ME === */

const SignInPage = () => <div><p>SignIn page!</p><GoogleLoginButton onClick={() => signIn(googleAuthProvider)} /></div>
const HomePage = () => (<div>
  <img src={logo} className="App-logo" alt="logo" />
  <p>Home page!</p>
  <a href="/profile">Go to profile page</a>
</div>)
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
]);


function App() {
  return (
    <PageLayout>
      <RouterProvider router={router} />
    </PageLayout>
  );
}

export default App;

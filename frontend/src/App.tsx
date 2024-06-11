import axios from 'axios';
import { useEffect, useState } from 'react';
import { GoogleLoginButton } from 'react-social-login-buttons';
import './App.css';
import { API_URL } from './lib/api';
import { googleAuthProvider, signIn, useCurrentUser } from './lib/firebase';
import logo from './logo.svg';

type BasicUser = {
  id: number
  name?: string
}

const LoginForm = () => {  
  return (
    <GoogleLoginButton onClick={() => signIn(googleAuthProvider)} />
  )  
}

function App() {
  const [users, setUsers] = useState<BasicUser[]>([])
  const user = useCurrentUser()

  useEffect(() => {
    // when component mounts, get a list of the users
    (async function () {
      const response = await axios.get(`${API_URL}/user`)
      setUsers(response.data)
    })()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>You {user === null ? "aren't" : 'are'} logged in!</p>
        <h2>Registered users:</h2>
        <ul>
          {users.map(user => <li key={user.id}>#{user.id}: {user.name}</li>)}
        </ul>
        <LoginForm />
      </header>
    </div>
  );
}

export default App;

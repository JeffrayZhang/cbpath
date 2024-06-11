import React, { Fragment, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { API_URL } from './lib/api';

type BasicUser = {
  id: number
  email: string
  name?: string
}

type CreateUserFormProps = {
  onNewUserCreated: (user: BasicUser) => void
}

const CreateUserForm = ({ onNewUserCreated }: CreateUserFormProps) => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState<string>()

  async function submitForm() {
    const response = await axios.post(`${API_URL}/user`, { email, name })
    onNewUserCreated(response.data)
  }

  return (
    <Fragment>
      <h3>Create User:</h3>
      <form style={{ padding: 50, border: '1px solid white', marginBottom: 300 }} onSubmit={event => {
        event.preventDefault()
        submitForm()
      }}>
        <div>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <button type="submit">Register</button>
        </div>
      </form>
    </Fragment>
  )
}

function App() {
  const [users, setUsers] = useState<BasicUser[]>([])

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
        <h2>Registered users:</h2>
        <ul>
          {users.map(user => <li key={user.id}>#{user.id}: {user.email} / {user.name}</li>)}
        </ul>
        <CreateUserForm onNewUserCreated={(newUser) => setUsers([...users, newUser])} />
      </header>
    </div>
  );
}

export default App;

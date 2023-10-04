import { useState } from 'react'

import Form from './Form'
import './App.css'

function App() {

  const [users, setUsers] = useState([])

  const addUser = (user) => {
    setUsers([...users, user])
  }

  return (
    <>
      <div>Users</div>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user.fname} {user.femail}</li>
        ))}
      </ul>
      <div>Form</div>
      <Form addUser={addUser} />
    </>
  )
}

export default App

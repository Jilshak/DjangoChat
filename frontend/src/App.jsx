import { Routes, Route } from 'react-router-dom'
import LoginPage from './Pages/LoginPage'
import SignupPage from './Pages/SignupPage'
import ChatsPage from './Pages/ChatsPage'

function App() {

  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='/' element={<ChatsPage />} />
    </Routes>
  )
}

export default App

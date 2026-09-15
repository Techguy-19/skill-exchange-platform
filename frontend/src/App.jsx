import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/home'
import Skills from './pages/Skills'
import Requests from './pages/Requests'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import UserProfile from './pages/UserProfile'
import Chat from './pages/Chat'

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/chat/:requestId" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
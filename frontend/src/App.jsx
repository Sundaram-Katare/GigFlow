import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/jobs' element={<Jobs />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;
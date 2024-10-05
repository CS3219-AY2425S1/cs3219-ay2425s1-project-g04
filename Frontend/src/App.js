import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateQn from './components/question/CreateQn';
import EditQn from './components/question/EditQn';
import Home from './components/Home';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Default route to Login page */}
          <Route path='/' element={<Navigate to='/login' />} />

          {/* Login page route */}
          <Route path='/login' element={<Login />} />

          {/* Sign-up page route */}
          <Route path='/signup' element={<SignUp />} />

          {/* Home page route */}
          <Route path='/home' element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

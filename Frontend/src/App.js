import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import CollaborationSpace from './components/collab/CollaborationSpace';
import EditProfilePage from "./components/user/EditProfilePage";
import HistoryPage from "./components/user/HistoryPage"
import ProtectedRoute from './components/routes/ProtectedRoute';

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
          <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />

          {/* Edit Profile page route */}
          <Route path='/profile/:id' element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />

          {/* History page route */}
          <Route path='/history/:id' element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />

          {/* Collaboration page route */}
          <Route path="/collaboration/:roomId" element={<ProtectedRoute><CollaborationSpace /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

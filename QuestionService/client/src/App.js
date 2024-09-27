import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import CreateQn from './components/question/CreateQn';
import EditQn from './components/question/EditQn';
import Home from './components/Home';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/create' element={<CreateQn/>}></Route>
        <Route path='/update/:question_db_id' element={<EditQn/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
